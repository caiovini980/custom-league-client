import { ServiceRepoAbstract } from '@main/abstracts/service-repo.abstract';
import { ServiceRepo } from '@main/decorators/service-repo.decorator';
import { AppConfigKeysEnum } from '@main/exceptions/app-config-keys.enum';
import { AppConfigEntity } from '@main/modules/app-config/app-config.entity';
import { AppConfigRepository } from '@main/modules/app-config/app-config.repository';
import { dialog } from 'electron';

@ServiceRepo(AppConfigRepository)
export class AppConfigService extends ServiceRepoAbstract<AppConfigRepository> {
  async getAppConfig() {
    const configList = await this.repository.find();
    return configList.map((c) => {
      return {
        name: c.id.name,
        value: c.id.convertValue(c.value),
      };
    });
  }

  async setRiotClientPath() {
    const paths = dialog.showOpenDialogSync(this.mainWin, {
      properties: ['openDirectory'],
    });
    if (!paths) return;

    const ent = new AppConfigEntity();
    ent.id = AppConfigKeysEnum.RIOT_CLIENT_PATH;
    ent.value = paths[0];

    await this.repository.save(ent);
  }

  async getRiotClientPath() {
    return await this.repository.findOneBy({
      id: AppConfigKeysEnum.RIOT_CLIENT_PATH,
    });
  }
}
