import { ServiceRepoAbstract } from '@main/abstracts/service-repo.abstract';
import { ServiceRepo } from '@main/decorators/service-repo.decorator';
import { AppConfigEnum } from '@main/enums/app-config.enum';
import { AppConfigEntity } from '@main/modules/app-config/app-config.entity';
import { AppConfigRepository } from '@main/modules/app-config/app-config.repository';
import {
  GetAppConfigResponse,
  type SetAppConfigData,
} from '@shared/typings/ipc-function/handle/app-config.typing';
import { dialog } from 'electron';

@ServiceRepo(AppConfigRepository)
export class AppConfigService extends ServiceRepoAbstract<AppConfigRepository> {
  async getAppConfig(): Promise<GetAppConfigResponse> {
    const configList = await this.repository.find();
    return configList.reduce((prev, curr) => {
      return Object.assign(prev, {
        [curr.id.name]: curr.id.convertValue(curr.value),
      });
    }, {} as GetAppConfigResponse);
  }

  async setAppConfig(data: SetAppConfigData) {
    switch (data.name) {
      case 'RIOT_CLIENT_PATH': {
        const paths = dialog.showOpenDialogSync(this.mainWin, {
          properties: ['openDirectory'],
        });
        if (!paths) return;

        await this.saveConfig(data.name, paths[0]);

        break;
      }

      default: {
        await this.saveConfig(data.name, data.value);
      }
    }

    this.sendMsgToRender('onChangeAppConfig', await this.getAppConfig());
  }

  private async saveConfig<K extends keyof GetAppConfigResponse>(
    name: K,
    value: GetAppConfigResponse[K],
  ) {
    const ent = new AppConfigEntity();
    ent.id = AppConfigEnum.valueByName(name);
    ent.value = value;

    await this.repository.save(ent);
  }
}
