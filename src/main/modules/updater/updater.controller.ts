import { IpcHandle } from '@main/ipc';
import { Controller } from '@nestjs/common';
import { UpdaterService } from './updater.service';

@Controller('updater')
export class UpdaterController {
  constructor(private updaterService: UpdaterService) {}

  @IpcHandle('check')
  async checkUpdate() {
    return await this.updaterService.checkUpdate();
  }

  @IpcHandle('quitAndInstallUpdate')
  async quitAndInstallUpdate() {
    return await this.updaterService.quitAndInstallUpdate();
  }
}
