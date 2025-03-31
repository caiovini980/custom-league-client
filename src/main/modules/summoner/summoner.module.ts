import { Module } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { SummonerController } from './summoner.controller';

@Module({
  imports: [],
  providers: [SummonerService],
  controllers: [SummonerController],
})
export class SummonerModule {}
