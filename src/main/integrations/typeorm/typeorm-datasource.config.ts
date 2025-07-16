import path from 'node:path';
import { app } from 'electron';
import { DataSource, DataSourceOptions } from 'typeorm';
import { migration } from './migrations';

export const dataSourceOptions = (databaseName?: string): DataSourceOptions => {
  const defaultDbName = 'main.db';

  const dbName = () => {
    if (process.env.NODE_ENV === 'development') return `dev-${defaultDbName}`;
    return defaultDbName;
  };

  const getPath = () => {
    if (process.env.NODE_ENV === 'development') return '';
    return app.getPath('userData');
  };

  return {
    type: 'better-sqlite3',
    database: path.join(getPath(), '.db', `${databaseName || dbName()}`),
    migrationsTableName: 'typeorm_migrations',
    migrations: migration,
    logging: process.env.LOGGER_ORM_QUERY === 'true',
  };
};

export default new DataSource(dataSourceOptions());
