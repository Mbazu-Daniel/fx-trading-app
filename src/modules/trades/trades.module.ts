import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/common/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TradeRepository } from './trade.repository';
import { TradesService } from './trades.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    CurrencyModule,
    TransactionsModule,
    forwardRef(() => WalletsModule),
  ],
  providers: [TradesService, TradeRepository],
  exports: [TradesService, TradeRepository],
})
export class TradesModule {}
