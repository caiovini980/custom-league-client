import { IpcHandle } from '@main/ipc';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  SummonerGetCurrentSummonerResponse,
  SummonerGetSummonerByIdResponse,
} from '@shared/typings/ipc-function/handle/summoner.typing';
import { SummonerService } from './summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  @IpcHandle('getCurrentSummoner')
  async getCurrentSummoner(): Promise<SummonerGetCurrentSummonerResponse> {
    return await this.summonerService.getCurrentSummoner();
  }

  @IpcHandle('getSummonerById')
  async getSummonerById(
    @Payload() payload: number,
  ): Promise<SummonerGetSummonerByIdResponse> {
    return await this.summonerService.getSummonerById(payload);
  }
}
