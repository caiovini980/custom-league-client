import { spawn } from 'node:child_process';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { AppConfigService } from '@main/modules/app-config/app-config.service';

@Service()
export class ClientService extends ServiceAbstract {
  constructor(
    private leagueClientService: LeagueClientService,
    private appConfigService: AppConfigService,
  ) {
    super();
  }

  async startAuthenticate() {
    this.leagueClientService.startAuthenticate();
  }

  async startLeagueClient() {
    const appConfig = await this.appConfigService.getAppConfig();
    spawn(
      `${appConfig.RIOT_CLIENT_PATH}\\RiotClientServices.exe`,
      ['--launch-product=league_of_legends', '--launch-patchline=live'],
      {
        detached: true,
        stdio: 'ignore',
      },
    );
    return this.leagueClientService.startAuthenticate();
  }

  async getIsClientConnected() {
    return this.leagueClientService.isLeagueClientConnected();
  }
}
