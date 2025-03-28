import { IpcHandle } from '@main/ipc';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import type { SetAppConfigData } from '@shared/typings/ipc-function/handle/app-config.typing';
import { AppConfigService } from './app-config.service';

@Controller('appConfig')
export class AppConfigController {
  constructor(private appConfigService: AppConfigService) {}

  @IpcHandle('getConfig')
  async getAppConfig() {
    return await this.appConfigService.getAppConfig();
  }

  @IpcHandle('setConfig')
  async setConfig(@Payload() payload: SetAppConfigData) {
    await this.appConfigService.setAppConfig(payload);
  }
}
