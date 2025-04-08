import { ENVIRONMENT } from 'src/common/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Currency, Trade, Transaction, User, Wallet } from '../entities';
import {
  Currency1744125706250,
  Trades1744142273976,
  Transactions1744131512960,
  Users1744083658006,
  Wallets1744126763060,
} from '../migrations';

const isDev = ENVIRONMENT.APP.NODE_ENV === 'development';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: ENVIRONMENT.DB.HOST,
  port: ENVIRONMENT.DB.PORT,
  username: ENVIRONMENT.DB.USERNAME,
  password: ENVIRONMENT.DB.PASSWORD,
  database: ENVIRONMENT.DB.NAME,
  synchronize: false,
  entities: [User, Currency, Wallet, Transaction, Trade],
  migrations: [
    Users1744083658006,
    Currency1744125706250,
    Wallets1744126763060,
    Transactions1744131512960,
    Trades1744142273976,
  ],
  logging: isDev,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
