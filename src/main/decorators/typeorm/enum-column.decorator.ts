import { ClassType } from '@main/typings/generic.typing';
import { IStaticEnum } from 'ts-jenum';
import { Column } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

interface EnumColumnOptions extends ColumnOptions {
  enumClass: ClassType<unknown>;
}

export const EnumColumn = ({
  enumClass,
  ...options
}: EnumColumnOptions): PropertyDecorator => {
  return (target, propertyKey) => {
    const op: ColumnOptions = {
      type: 'varchar',
      ...options,
      transformer: {
        to(value?: InstanceType<IStaticEnum<unknown>>) {
          return value?.enumName;
        },
        from(value?: string) {
          if (value)
            return (enumClass as IStaticEnum<unknown>).valueByName(value);
          return null;
        },
      },
    };
    return Column(op)(target, propertyKey);
  };
};
