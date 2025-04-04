import path from 'node:path';
import { LoggerAbstract } from '@main/abstracts/logger.abstract';
import { ContextService } from '@main/context/context.service';
import { BrowserWindowRegisterService } from '@main/integrations/browser-window-register/browser-window-register.service';
import { IpcMainToRenderer } from '@shared/typings/ipc.typing';
import { BrowserWindow, app } from 'electron';

export abstract class ServiceAbstract extends LoggerAbstract {
  protected ctx!: ContextService;
  protected mainWin!: BrowserWindow;
  protected browserWindowRegisterService!: BrowserWindowRegisterService;

  protected getResourcePath() {
    return path.join(app.getPath('userData'), 'resources');
  }

  protected getLolGameDataResourcePath(version: string) {
    return path.join(this.getResourcePath(), version);
  }

  protected getClientInfoPath() {
    return path.join(this.getResourcePath(), 'clientInfo.json');
  }

  protected sendMsgToRender<K extends keyof IpcMainToRenderer>(
    channel: K,
    ...msg: Parameters<IpcMainToRenderer[K]>
  ) {
    this.mainWin.webContents.send(channel as string, ...msg);
    this.browserWindowRegisterService.getBrowserWindowList().forEach((b) => {
      b.webContents.send(channel as string, ...msg);
    });
  }

  protected registerChildBrowserWindow(browser: BrowserWindow) {
    const reg = this.browserWindowRegisterService.registerBrowser(browser);
    browser.once('close', () => {
      this.mainWin.webContents.send('onCloseIkariamBrowser', { id: reg.id });
    });

    return reg;
  }
}
