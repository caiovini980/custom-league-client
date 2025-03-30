import { spawn } from 'node:child_process';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { AppConfigService } from '@main/modules/app-config/app-config.service';
import {
  ClientMakeRequestPayload,
  ClientMakeRequestResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import axios from 'axios';

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

  async makeRequest(
    data: ClientMakeRequestPayload<string>,
  ): Promise<ClientMakeRequestResponse> {
    this.logger.debug(`make request: ${JSON.stringify(data)}`);
    return await this.leagueClientService.handleEndpoint(
      data.method,
      data.uri,
      data.data,
    );
  }

  async getVersion() {
    const regionLocale =
      await this.leagueClientService.handleEndpoint<RiotClientRegionLocale>(
        'GET',
        '/riotclient/region-locale',
        undefined,
      );
    if (!regionLocale.ok) {
      throw new Error('Region error');
    }

    const regionData = await axios({
      method: 'GET',
      url: `https://ddragon.leagueoflegends.com/realms/${regionLocale.body?.webRegion}.json`,
    });

    return regionData.data.dd as string;
  }
}
