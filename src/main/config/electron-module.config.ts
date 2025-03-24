import { join } from 'node:path';
import { optimizer } from '@electron-toolkit/utils';
import { ElectronModule } from '@main/ipc';
import { DynamicModule } from '@nestjs/common';
import { BrowserWindow, app, shell } from 'electron';

export const electronModuleConfig: DynamicModule = ElectronModule.registerAsync(
  {
    isGlobal: true,
    useFactory: async () => {
      function createWindow() {
        const isDev = !app.isPackaged;
        const win = new BrowserWindow({
          title: 'League Client Helper',
          width: 1024,
          height: 768,
          show: false,
          autoHideMenuBar: true,
          webPreferences: {
            contextIsolation: true,
            sandbox: false,
            preload: join(__dirname, '../preload/index.js'),
          },
        });

        win.setMenu(null);
      
        win.on('closed', () => {
          win.destroy();
        });

        if (isDev) {
          win.webContents.openDevTools()
          
          if (process.platform === 'win32') {
            process.on('message', (data) => {
              if (data === 'graceful-exit') app.quit();
            });
          } else {
            process.on('SIGTERM', () => {
              app.quit();
            });
          }
        }

        win.on('ready-to-show', () => {
          win.show();
        });

        win.webContents.setWindowOpenHandler((details) => {
          shell.openExternal(details.url);
          return { action: 'deny' };
        });

        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (isDev && process.env['ELECTRON_RENDERER_URL']) {
          win.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
          win.loadFile(join(__dirname, '../renderer/index.html'));
        }
        return win;
      }

      let win = createWindow();

      app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) win = createWindow();
      });

      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
      });

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
      });

      return { win };
    },
  },
);
