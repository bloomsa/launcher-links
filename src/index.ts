import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ILauncher } from '@jupyterlab/launcher';
import { launchIcon } from '@jupyterlab/ui-components';

/**
 * Initialization data for the lab-launcher-customization extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'lab-launcher-customization:plugin',
  description: 'Add abitrary launcher icons ',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log('JupyterLab extension lab-launcher-customization is activated!');

    launcher.add({
      command: 'lab-launcher-customization:open-webpage',
      category: 'Other',
      rank: 1,
      args: { isLauncher: true }
    });

    let webpageUrl = 'https://www.example.com';

    const command = 'lab-launcher-customization:open-webpage';
    app.commands.addCommand(command, {
      label: 'Open Webpage',
      caption: 'Open a webpage in a new tab',
      icon: launchIcon,
      execute: () => {
        window.open(webpageUrl, '_blank');
      }
    });

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('lab-launcher-customization settings loaded:', settings.composite);
          
          const updateSettings = () => {
            webpageUrl = settings.composite.webpageUrl as string;
          };
          
          updateSettings();
          settings.changed.connect(updateSettings);
        })
        .catch(reason => {
          console.error('Failed to load settings for lab-launcher-customization.', reason);
        });
    }
  }
};

export default plugin;
