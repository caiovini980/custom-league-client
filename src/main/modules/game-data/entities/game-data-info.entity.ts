import { GameDataEntity } from '@main/modules/game-data/entities/game-data.entity';
import { Entity } from 'typeorm';

@Entity('game_data_info')
export class GameDataInfoEntity extends GameDataEntity {}
