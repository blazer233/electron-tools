import { app, ipcMain, shell } from 'electron';

import { ModuleFunction } from '@app/app';
import { configStore } from '@app/stores/config';

export type AppControlAction = 'devtools' | 'minimize' | 'maximize' | 'close';

const GeneralModule: ModuleFunction = context => {
  // 窗口关闭、最大化、最小化等控制功能
  ipcMain.on('appControl', async (_, action: AppControlAction) => {
    const { window } = context;

    if (!window) return;

    switch (action) {
      case 'devtools': {
        window.webContents.toggleDevTools();
        break;
      }

      case 'minimize': {
        window.minimize();
        break;
      }

      case 'maximize': {
        window.isMaximized() ? window.unmaximize() : window.maximize();
        break;
      }

      case 'close': {
        window.close();
        break;
      }
    }
  });

  // 打开链接
  ipcMain.on('openExternal', async (_, link) => {
    return shell.openExternal(link);
  });

  ipcMain.on('openPath', async (_, link) => shell.openPath(link));

  ipcMain.handle('getConfig', async () => configStore.store);

  ipcMain.handle('setConfig', async (e, config = {}) => {
    config.downloadaddress = config.downloadaddress || app.getPath('downloads')
    return (configStore.store = config);
  });
};

export default GeneralModule;
