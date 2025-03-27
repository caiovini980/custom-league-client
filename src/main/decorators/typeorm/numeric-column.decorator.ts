import { TypeOrmUtil } from '@main/utils/typeorm.util';
import { Column } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

export const NumericColumn = (options?: ColumnOptions): PropertyDecorator => {
  return (target, propertyKey) => {
    const op: ColumnOptions = {
      type: 'numeric',
      ...options,
      transformer: TypeOrmUtil.transformNumber(),
    };
    return Column(op)(target, propertyKey);
  };
};
