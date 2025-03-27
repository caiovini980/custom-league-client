import { IpcHandle } from '@main/ipc';
import { Controller } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

@Controller('appConfig')
export class AppConfigController {
  constructor(private appConfigService: AppConfigService) {}

  @IpcHandle('getConfig')
  async getAppConfig() {
    return await this.appConfigService.getAppConfig();
  }

  @IpcHandle('setRiotPath')
  async setRiotPath() {
    await this.appConfigService.setRiotClientPath();
  }
}
