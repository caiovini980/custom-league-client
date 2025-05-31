import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { autoUpdater } from 'electron-updater';

@Service()
export class UpdaterService extends ServiceAbstract {
  constructor() {
    super();
    autoUpdater.logger = this.logger;
    autoUpdater.forceDevUpdateConfig = false;

    autoUpdater.on('download-progress', (data) => {
      this.sendMsgToRender('onDownloadingUpdate', data);
    });

    autoUpdater.on('update-downloaded', () => {
      this.sendMsgToRender('onUpdateComplete');
    });

    autoUpdater.on('checking-for-update', () => {
      this.sendMsgToRender('onCheckingForUpdate');
    });
  }

  async checkUpdate() {
    const status = await autoUpdater.checkForUpdates();
    return status?.isUpdateAvailable ?? false;
  }

  async quitAndInstallUpdate() {
    return autoUpdater.quitAndInstall();
  }
}
