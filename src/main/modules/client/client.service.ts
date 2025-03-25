import { spawn } from 'node:child_process';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';

@Service()
export class ClientService extends ServiceAbstract {
  constructor(private leagueClientService: LeagueClientService) {
    super();
  }

  async startAuthenticate() {
    this.leagueClientService.startAuthenticate();
  }

  async startLeagueClient() {
    //TODO: be configurable
    const RIOT_CLIENT_PATH =
      'D:\\Riot Games\\Riot Client\\RiotClientServices.exe';
    spawn(
      RIOT_CLIENT_PATH,
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
