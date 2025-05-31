import { EntityAbstract } from '@main/abstracts/entity.abstract';
import { EnumColumn } from '@main/decorators/typeorm';
import { AppConfigEnum } from '@main/enums/app-config.enum';
import type { Null } from '@shared/typings/generic.typing';
import { Column, Entity } from 'typeorm';

@Entity('app_config')
export class AppConfigEntity extends EntityAbstract {
  @EnumColumn({ enumClass: AppConfigEnum, primary: true })
  id!: AppConfigEnum;

  @Column({ type: 'varchar' })
  value!: Null<string>;
}
