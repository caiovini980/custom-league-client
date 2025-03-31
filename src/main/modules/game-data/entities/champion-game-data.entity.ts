import { GameDataEntity } from '@main/modules/game-data/entities/game-data.entity';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('champion_game_data')
export class ChampionGameDataEntity extends GameDataEntity {
  @PrimaryColumn({ type: 'varchar' })
  championId!: string;

  @PrimaryColumn({ type: 'varchar' })
  championKey!: string;
}
