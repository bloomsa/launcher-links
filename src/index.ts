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
  rank?: number;
}

// Add this function to process the SVG string
function namespaceSvgClasses(svgStr: string, namespace: string): string {
  const prefix = `${namespace}-cls-`;

  svgStr = svgStr.replace(/\.cls-(\d+)\s*{([^}]+)}/g, `.${prefix}$1{$2}`);
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
  id: 'lab-launcher-customization:plugin',
  description: 'Add arbitrary launcher icons based on settings.',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log(
      'JupyterLab extension lab-launcher-customization is activated!'
    );

    // Keep track of added commands and launcher items to dispose of them later
    let commandsDisposables: IDisposable[] = [];
    let launcherItemsDisposables: IDisposable[] = [];
    // keep track of which categories have been used
    let categories = ['Notebook', 'Console', 'Other'];

    // Function to update launchers based on settings
    const updateLaunchers = (settings: ISettingRegistry.ISettings) => {
      // Dispose of previous commands and launcher items
      commandsDisposables.forEach(d => d.dispose());
      commandsDisposables = [];
      launcherItemsDisposables.forEach(d => d.dispose());
      launcherItemsDisposables = [];

      // Safely get the launchers setting and cast through unknown
      const configuredLaunchers =
        (settings.get('launchers').composite as unknown as ILauncherItem[]) ||
        [];
      console.log('Updating launchers with:', configuredLaunchers);

      // Track which categories we've seen
      const seenCategories = new Set<string>();

      // First pass: add sentinel items for new categories
      configuredLaunchers.forEach(item => {
        const category = capitalizeFirst(item.category) || 'Other';
        if (!categories.includes(category) && !seenCategories.has(category)) {
          seenCategories.add(category);
          const sentinelId = `${plugin.id}:sentinel-${category.toLowerCase()}`;
          const commandDisposable = app.commands.addCommand(sentinelId, {
            label: category,
            caption: `Category: ${category}`,
            icon: LabIcon.resolve({ icon: 'ui-components:folder' }),
            execute: () => {} // No-op since this is just a sentinel
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
          const launcherItemDisposable = launcher.add({
            command: commandId,
            category: capitalizeFirst(item.category) || 'Other',
            rank: item.rank || 1
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
          console.log(
            'lab-launcher-customization settings loaded:',
            settings.composite
          );
          updateLaunchers(settings); // Initial population
          settings.changed.connect(updateLaunchers); // Update on change
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for lab-launcher-customization.',
            reason
          );
        });
    } else {
      console.warn(
        'ISettingRegistry not available. Cannot load custom launchers.'
      );
    }
  }
};

export default plugin;
