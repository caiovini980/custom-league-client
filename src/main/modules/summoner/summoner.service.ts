import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { IpcException } from '@main/exceptions/ipc.exception';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { SummonerGetSummonerByIdResponse } from '@shared/typings/ipc-function/handle/summoner.typing';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

@Service()
export class SummonerService extends ServiceAbstract {
  constructor(private leagueClientService: LeagueClientService) {
    super();
  }

  async getCurrentSummoner() {
    const summonerData =
      await this.leagueClientService.handleEndpoint<LolSummonerV1Summoners_Id>(
        'GET',
        '/lol-summoner/v1/current-summoner',
        undefined,
      );

    return this.getSummonerById(summonerData.body.summonerId);
  }

  async getSummonerById(
    summonerId: number,
  ): Promise<SummonerGetSummonerByIdResponse> {
    const summonerData =
      await this.leagueClientService.handleEndpoint<LolSummonerV1Summoners_Id>(
        'GET',
        `/lol-summoner/v1/summoners/${summonerId}`,
        undefined,
      );

    if (!summonerData.ok) {
      throw new IpcException('unknownError', 'summonerData get error');
    }

    const summonerProfileData =
      await this.leagueClientService.handleEndpoint<LolSummonerV1SummonerProfile>(
        'GET',
        `/lol-summoner/v1/summoner-profile?puuid=${summonerData.body.puuid}`,
        undefined,
      );

    if (!summonerProfileData.ok) {
      throw new IpcException('unknownError', 'summonerProfileData get error');
    }

    return {
      info: summonerData.body,
      profile: summonerProfileData.body,
    };
  }
}
