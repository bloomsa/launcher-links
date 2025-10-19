import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ILauncher } from '@jupyterlab/launcher';
import { LabIcon } from '@jupyterlab/ui-components';
import { IDisposable } from '@lumino/disposable';

interface ILauncherItem {
  id: string;
  label: string;
  url: string;
  icon?: string; // LabIcon name or SVG string
  category?: string;
}

function namespaceSvgClasses(svgStr: string, namespace: string): string {
  const prefix = `${namespace}-cls-`;
  // finds and matches css rules, i.e. .cls-1 {...} with .open-google-cls-1 {...}
  svgStr = svgStr.replace(/\.cls-(\d+)\s*{([^}]+)}/g, `.${prefix}$1{$2}`);
  // updates references to classes w/ namespaced classes ^
  svgStr = svgStr.replace(/class="cls-(\d+)"/g, `class="${prefix}$1"`);

  return svgStr;
}

function capitalizeFirst(str: string | undefined): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'launcher-links:plugin',
  description: 'Add arbitrary launcher icons based on settings.',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log('JupyterLab extension launcher-links is activated!');
    // Keep track of added commands and launcher items to dispose of them later
    let commandsDisposables: IDisposable[] = [];
    let launcherItemsDisposables: IDisposable[] = [];
    const categories = ['Notebook', 'Console', 'Other'];

    const updateLaunchers = (settings: ISettingRegistry.ISettings) => {
      commandsDisposables.forEach(d => d.dispose());
      commandsDisposables = [];
      launcherItemsDisposables.forEach(d => d.dispose());
      launcherItemsDisposables = [];

      const configuredLaunchers =
        (settings.get('launchers').composite as unknown as ILauncherItem[]) ||
        [];
      console.log('Updating launchers with:', configuredLaunchers);

      const seenCategories = new Set<string>();

      // first pass - add sentinel items for new categories
      configuredLaunchers.forEach(item => {
        const category = capitalizeFirst(item.category) || 'Other';
        if (!categories.includes(category) && !seenCategories.has(category)) {
          seenCategories.add(category);
          const sentinelId = `${plugin.id}:sentinel-${category.toLowerCase()}`;
          const commandDisposable = app.commands.addCommand(sentinelId, {
            label: category,
            caption: `sentinel-item:${category}`,
            icon: LabIcon.resolve({ icon: 'ui-components:folder' }),
            execute: () => {} // No-op for sentinel
          });
          commandsDisposables.push(commandDisposable);
          const launcherItemDisposable = launcher.add({
            command: sentinelId,
            category: category,
            rank: -Infinity
          });
          launcherItemsDisposables.push(launcherItemDisposable);
        }
      });

      // Second pass: add actual launcher items
      const categoryRankState = new Map<string, number>();
      configuredLaunchers.forEach(item => {
        const commandId = `${plugin.id}:${item.id}`;
        const iconStr = item.icon || 'ui-components:launch';

        // Try to resolve LabIcon by name, otherwise assume it's an SVG string
        let commandIcon: LabIcon;
        try {
          if (!iconStr.trim().startsWith('<svg') && iconStr.includes(':')) {
            commandIcon = LabIcon.resolve({
              icon: iconStr
            });
          } else {
            const iconName = `${plugin.id}-icon:${item.id}`;
            const namespaceSvg = namespaceSvgClasses(iconStr, item.id);
            commandIcon = new LabIcon({
              name: iconName,
              svgstr: namespaceSvg
            });
          }
        } catch (e) {
          console.warn(
            `Could not resolve or create icon for ${commandId}. Icon string: '${iconStr.substring(0, 70)}...'. Using default. Error:`,
            e
          );
          commandIcon = LabIcon.resolve({ icon: 'ui-components:launch' });
        }

        if (!commandIcon) {
          console.error(
            `Failed to obtain any icon instance for ${commandId}. Skipping item.`
          );
          return; // Skip this item if icon is still somehow undefined
        }

        try {
          // Add the command to the application's command registry
          const commandDisposable = app.commands.addCommand(commandId, {
            label: item.label,
            caption: `Open ${item.label}`,
            icon: commandIcon,
            execute: () => {
              window.open(item.url, '_blank');
            }
          });
          commandsDisposables.push(commandDisposable);
          // Add the command to the launcher
          const category = capitalizeFirst(item.category) || 'Other';
          const categoryIndex = categoryRankState.get(category) ?? 0;
          categoryRankState.set(category, categoryIndex + 1);
          // Default to appending after the built-in launcher entries while still preserving
          // relative order between custom items in the same category.
          const derivedRank = 1000 + categoryIndex;
          const launcherItemDisposable = launcher.add({
            command: commandId,
            category,
            rank: derivedRank
          });
          launcherItemsDisposables.push(launcherItemDisposable);
        } catch (error) {
          console.error(`Failed to add launcher item '${item.label}':`, error);
        }
      });
    };

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('launcher-links settings loaded:', settings.composite);
          updateLaunchers(settings); // Initial population
          settings.changed.connect(updateLaunchers); // Update on change
        })
        .catch(reason => {
          console.error('Failed to load settings for launcher-links.', reason);
        });
    } else {
      console.warn(
        'ISettingRegistry not available. Cannot load custom launchers.'
      );
    }
  }
};

export default plugin;
