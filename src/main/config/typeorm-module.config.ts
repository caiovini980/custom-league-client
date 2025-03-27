import { dataSourceOptions } from '@main/integrations/typeorm/typeorm-datasource.config';
import { DynamicModule, Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmModuleOptions = (
  dataSource: DataSourceOptions,
): TypeOrmModuleOptions => {
  return {
    ...dataSource,
    retryAttempts: 3,
    autoLoadEntities: true,
  };
};

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dataSource = dataSourceOptions();
    return typeOrmModuleOptions(dataSource);
  }
}

export const typeormModuleConfig: DynamicModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options) => {
    if (!options) {
      throw new Error('Error options dataSourceFactory');
    }
    return new DataSource(options);
  },
});
