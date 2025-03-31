import { Column, PrimaryColumn } from 'typeorm';

export abstract class GameDataEntity {
  @PrimaryColumn({ type: 'varchar' })
  version!: string;

  @PrimaryColumn({ type: 'varchar' })
  language!: string;

  @Column({ type: 'text' })
  data!: string;
}
