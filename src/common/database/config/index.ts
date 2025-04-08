import { ENVIRONMENT } from 'src/common/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../entities';
import { Users1744083658006 } from '../migrations';

const isDev = ENVIRONMENT.APP.NODE_ENV === 'development';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: ENVIRONMENT.DB.HOST,
  port: ENVIRONMENT.DB.PORT,
  username: ENVIRONMENT.DB.USERNAME,
  password: ENVIRONMENT.DB.PASSWORD,
  database: ENVIRONMENT.DB.NAME,
  synchronize: false,
  entities: [User],
  migrations: [Users1744083658006],
  logging: isDev,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
