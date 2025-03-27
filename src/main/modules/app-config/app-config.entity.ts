import { EntityAbstract } from '@main/abstracts/entity.abstract';
import { EnumColumn } from '@main/decorators/typeorm';
import { AppConfigKeysEnum } from '@main/exceptions/app-config-keys.enum';
import type { Null } from '@shared/typings/generic.typing';
import { Column, Entity } from 'typeorm';

@Entity('app_config')
export class AppConfigEntity extends EntityAbstract {
  @EnumColumn({ enumClass: AppConfigKeysEnum, primary: true })
  id!: AppConfigKeysEnum;

  @Column({ type: 'varchar' })
  value!: Null<string>;
}
