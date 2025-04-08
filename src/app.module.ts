import { Module, OnModuleInit } from '@nestjs/common';
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
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    CurrencyModule,
    WalletsModule,
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
  constructor(
    private readonly dataSource: DataSource,
    private readonly currencyService: CurrencyService,
  ) {}
  async onModuleInit() {
    DbTransactionHelper.initialize(this.dataSource);

    const currencies = await this.currencyService.findAll();

    // Check if NGN currency exists, if not, create it
    if (!currencies.some((currency) => currency.code === 'NGN')) {
      await this.currencyService.create({
        code: 'NGN',
        name: 'Nigerian Naira',
        isActive: true,
      });
      console.log('NGN currency created');
    }

    // Check if USD currency exists, if not, create it
    if (!currencies.some((currency) => currency.code === 'USD')) {
      await this.currencyService.create({
        code: 'USD',
        name: 'United States Dollar',
        isActive: true,
      });
      console.log('USD currency created');
    }
  }
}
