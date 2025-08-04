import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import {
  VersionInfo,
  VersionInfoChangeLog,
} from '@shared/typings/ipc-function/handle/updater.typing';
import { autoUpdater } from 'electron-updater';
import fs from 'fs-extra';
import path from 'node:path';

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

  async versionInfo(): Promise<VersionInfo> {
    const currentVersion = autoUpdater.currentVersion.version;
    const releaseCachePath = path.join(this.getResourcePath(), 'releases.json');
    const owner = 'caiovini980';
    const repo = 'custom-league-client';

    let releases: VersionInfoChangeLog[] = [];
    if (fs.existsSync(releaseCachePath)) {
      releases = fs.readJSONSync(releaseCachePath);
    }

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
    );

    if (res.status === 200) {
      releases = await res.json();
      fs.writeJSONSync(releaseCachePath, releases);
    }

    return {
      version: currentVersion,
      releases,
    };
  }

  async quitAndInstallUpdate() {
    return autoUpdater.quitAndInstall();
  }
}
