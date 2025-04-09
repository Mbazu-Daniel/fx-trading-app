import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './common/database/config';
import { JwtAuthGuard, RoleGuard } from './common/guards';
import { DbTransactionHelper } from './common/helpers';
import { AuthModule } from './modules/auth/auth.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { CurrencyService } from './modules/currency/currency.service';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TradesModule } from './modules/trades/trades.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    CurrencyModule,
    WalletsModule,
    TradesModule,
    ExchangeRateModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AppService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly currencyService: CurrencyService,
  ) {}
  async onModuleInit() {
    DbTransactionHelper.initialize(this.dataSource);

    const currencies = await this.currencyService.findAll();

    const requiredCurrencies = [
      { code: 'NGN', name: 'Nigerian Naira' },
      { code: 'USD', name: 'United States Dollar' },
    ];

    for (const { code, name } of requiredCurrencies) {
      if (!currencies.some((currency) => currency.code === code)) {
        await this.currencyService.createCurrency({
          code,
          name,
          isActive: true,
        });
        this.logger.log(`${code} currency created`);
      }
    }
  }
}
