import { spawn } from 'node:child_process';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientDataDownloadService } from '@main/integrations/league-client/league-client-data-download.service';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { AppConfigService } from '@main/modules/app-config/app-config.service';
import {
  ClientMakeRequestPayload,
  ClientMakeRequestResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import fs from 'fs-extra';

@Service()
export class ClientService extends ServiceAbstract {
  constructor(
    private leagueClientService: LeagueClientService,
    private leagueClientDataDownloadService: LeagueClientDataDownloadService,
    private appConfigService: AppConfigService,
  ) {
    super();
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

  async reloadGameData() {
    const clientInfoString = fs.readFileSync(this.getClientInfoPath(), {
      encoding: 'utf-8',
    });
    await this.leagueClientDataDownloadService.downloadGameData(
      JSON.parse(clientInfoString),
    );
  }
}
