import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { UsersModule } from '../users/users.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UsersModule, CurrencyModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService],
})
export class WalletsModule {}
