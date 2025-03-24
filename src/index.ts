import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the lab-launcher-customization extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'lab-launcher-customization:plugin',
  description: 'Add abitrary launcher icons ',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension lab-launcher-customization is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('lab-launcher-customization settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for lab-launcher-customization.', reason);
        });
    }
  }
};

export default plugin;
