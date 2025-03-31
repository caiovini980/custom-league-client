import { ChampionGameDataEntity } from '@main/modules/game-data/entities/champion-game-data.entity';
import { GameDataInfoEntity } from '@main/modules/game-data/entities/game-data-info.entity';
import { GameDataController } from '@main/modules/game-data/game-data.controller';
import { GameDataInfoRepository } from '@main/modules/game-data/repositories/game-data-info.repository';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameDataService } from './game-data.service';
import { ChampionGameDataRepository } from './repositories/champion-game-data.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ChampionGameDataEntity, GameDataInfoEntity]),
  ],
  providers: [
    GameDataService,
    ChampionGameDataRepository,
    GameDataInfoRepository,
  ],
  exports: [GameDataService],
  controllers: [GameDataController],
})
export class GameDataModule {}
