import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from '../currency/currency.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UsersModule,
    CurrencyModule,
    forwardRef(() => TransactionsModule),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService, WalletRepository],
})
export class WalletsModule {}
