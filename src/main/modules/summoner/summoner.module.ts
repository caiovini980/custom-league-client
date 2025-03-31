import { Module } from '@nestjs/common';
import { SummonerController } from './summoner.controller';
import { SummonerService } from './summoner.service';

@Module({
  imports: [],
  providers: [SummonerService],
  controllers: [SummonerController],
})
export class SummonerModule {}
