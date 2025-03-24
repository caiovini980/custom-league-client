import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';

@Service()
export class LobbyService extends ServiceAbstract {
    constructor(private leagueClientService: LeagueClientService) {
        super()
    }

  async createAram() {
    this.logger.info(`Creating ARAM: OK`);
    this.leagueClientService.handleEndpoint('POST', '/lol-lobby/v2/lobby', {
        "allowSpectators": null,
        "customGameMode": null,
        "gameCustomization": {},
        "gameType": "MATCHMADE",
        "gameTypeConfigId": 21,
        "lobbyName": null,
        "lobbyPassword": null,
        "mapId": null,
        "maxPartySize": 5,
        "maxTeamSize": 0,
        "queueId": 450
      })
  }
}