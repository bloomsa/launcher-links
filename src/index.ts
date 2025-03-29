import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ILauncher } from '@jupyterlab/launcher';
import { LabIcon } from '@jupyterlab/ui-components';
import { IDisposable } from '@lumino/disposable';

// Interface for the launcher item configuration
interface ILauncherItem {
  id: string;
  label: string;
  url: string;
  icon?: string; // LabIcon name or SVG string
  category?: string;
  rank?: number;
}

/**
 * Initialization data for the lab-launcher-customization extension.
 */
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
    console.log('JupyterLab extension lab-launcher-customization is activated!');

    // Keep track of added commands and launcher items to dispose them later
    let commandsDisposables: IDisposable[] = [];
    let launcherItemsDisposables: IDisposable[] = [];

    // Function to update launchers based on settings
    const updateLaunchers = (settings: ISettingRegistry.ISettings) => {
      // Dispose previous commands and launcher items
      commandsDisposables.forEach(d => d.dispose());
      commandsDisposables = [];
      launcherItemsDisposables.forEach(d => d.dispose());
      launcherItemsDisposables = [];

      // Safely get the launchers setting and cast through unknown
      const configuredLaunchers = (settings.get('launchers').composite as unknown as ILauncherItem[]) || [];
      console.log('Updating launchers with:', configuredLaunchers);

      configuredLaunchers.forEach(item => {
        const commandId = `${plugin.id}:${item.id}`;
        const iconStr = item.icon || 'ui-components:launch'; // Default icon

        // Try to resolve LabIcon by name, otherwise assume it's an SVG string
        let commandIcon: LabIcon;
        try {
          // Check if iconStr is in the format "module:iconName"
          if (iconStr.includes(':')) {
            // Resolve icon by name from the registry
            commandIcon = LabIcon.resolve({
              icon: iconStr
            });
          } else {
            // Assume it's an SVG string
            commandIcon = new LabIcon({
              name: `${plugin.id}-icon:${item.id}`,
              svgstr: iconStr
            });
          }
        } catch (e) {
            console.warn(`Could not resolve icon '${iconStr}' for ${commandId}. Using default.`);
            // Fallback to default launch icon
            commandIcon = LabIcon.resolve({ icon: 'ui-components:launch' });
        }


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
          category: item.category || 'Other', // Default category
          rank: item.rank || 1 // Default rank
        });
        launcherItemsDisposables.push(launcherItemDisposable);
      });
    };

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('lab-launcher-customization settings loaded:', settings.composite);
          updateLaunchers(settings); // Initial population
          settings.changed.connect(updateLaunchers); // Update on change
        })
        .catch(reason => {
          console.error('Failed to load settings for lab-launcher-customization.', reason);
        });
    } else {
      console.warn('ISettingRegistry not available. Cannot load custom launchers.');
      // Optionally, load default launchers here if settings are unavailable
    }
  }
};

export default plugin;
