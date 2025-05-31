import { LoggerAbstract } from '@main/abstract/logger.abstract';
import { Logger } from '@main/decorators/logger.decorator';
import { BrowserWindow } from 'electron';
import { v4 } from 'uuid';

@Logger()
export class BrowserWindowRegisterService extends LoggerAbstract {
  private browserRegisterList: Map<string, BrowserWindow> = new Map();

  registerBrowser(browser: BrowserWindow) {
    const id = v4();

    this.logger.info(`Registering browser window in key: ${id}`);

    this.browserRegisterList.set(id, browser);

    const unregister = () => {
      this.logger.info(`Unregistering browser window in key: ${id}`);
      this.browserRegisterList.delete(id);
    };

    return { unregister, id };
  }

  getBrowserWindowList() {
    return Array.from(this.browserRegisterList.values());
  }
}
