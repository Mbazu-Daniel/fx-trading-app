// src/services/trade.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TradeStatus, TransactionType } from 'src/common/enums';
import { CommonHelper } from 'src/common/helpers';
import { CurrencyService } from '../currency/currency.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { Trade } from './entities/trade.entity';
import { TradeRepository } from './trade.repository';

@Injectable()
export class TradesService {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly currencyService: CurrencyService,
    private readonly walletService: WalletsService,
    private readonly transactionService: TransactionsService,
  ) {}

  async findAll(): Promise<Trade[]> {
    return this.tradeRepository.findAll();
  }

  async findById(id: string): Promise<Trade> {
    const trade = await this.tradeRepository.findById(id);
    if (!trade) {
      throw new NotFoundException(`Trade with ID ${id} not found`);
    }
    return trade;
  }

  async findByReference(reference: string): Promise<Trade> {
    const trade = await this.tradeRepository.findByReference(reference);
    if (!trade) {
      throw new NotFoundException(
        `Trade with reference ${reference} not found`,
      );
    }
    return trade;
  }

  async findUserTrades(userId: string): Promise<Trade[]> {
    return this.tradeRepository.findUserTrades(userId);
  }

  async createTrade(
    userId: string,
    createTradeDto: CreateTradeDto,
  ): Promise<Trade> {
    // Validate currencies
    const [fromCurrency, toCurrency] = await Promise.all([
      this.currencyService.getCurrencyById(createTradeDto.fromCurrencyId),
      this.currencyService.getCurrencyById(createTradeDto.toCurrencyId),
    ]);

    // Check if currencies are valid and active
    if (!fromCurrency || !toCurrency) {
      throw new BadRequestException('Invalid currency IDs');
    }

    if (!fromCurrency.isActive || !toCurrency.isActive) {
      throw new BadRequestException('One or both currencies are not active');
    }

    if (fromCurrency.id === toCurrency.id) {
      throw new BadRequestException('Cannot trade between the same currency');
    }

    // Validate amount
    if (createTradeDto.fromAmount <= 0) {
      throw new BadRequestException('Trade amount must be greater than zero');
    }

    // Find or create user wallets
    const fromWallet = await this.walletService.getOrCreateWallet(
      userId,
      fromCurrency.id,
    );

    // Check if user has enough balance
    if (Number(fromWallet.balance) < createTradeDto.fromAmount) {
      throw new BadRequestException(
        `Insufficient ${fromCurrency.code} balance`,
      );
    }

    // Calculate trade details
    const rate = createTradeDto.rate;
    const toAmount = createTradeDto.fromAmount * rate;

    // Create trade record
    const trade = await this.tradeRepository.create({
      userId,
      fromCurrencyId: fromCurrency.id,
      toCurrencyId: toCurrency.id,
      fromAmount: createTradeDto.fromAmount,
      toAmount,
      rate,
      status: TradeStatus.PENDING,
      reference: `TRD-${CommonHelper.generateRandomReference()}`,
    });

    return trade;
  }

  async executeTrade(tradeId: string): Promise<Trade> {
    const trade = await this.findById(tradeId);

    if (trade.status !== TradeStatus.PENDING) {
      throw new BadRequestException(`Trade is already ${trade.status}`);
    }

    try {
      // Get wallets
      const [fromWallet, toWallet] = await Promise.all([
        this.walletService.getOrCreateWallet(
          trade.userId,
          trade.fromCurrencyId,
        ),
        this.walletService.getOrCreateWallet(trade.userId, trade.toCurrencyId),
      ]);

      const description = `Trade: ${trade.fromAmount} ${fromWallet.currency.code} to ${trade.toAmount} ${toWallet.currency.code}`;

      // Create transaction records
      const [fromTransaction, toTransaction] = await Promise.all([
        this.transactionService.createTransaction(fromWallet.id, {
          amount: trade.fromAmount,
          type: TransactionType.TRADE,
          description,
          reference: `TRD-FROM-${trade.reference}`,
        }),
        this.transactionService.createTransaction(toWallet.id, {
          amount: trade.toAmount,
          type: TransactionType.TRADE,
          description,
          reference: `TRD-TO-${trade.reference}`,
        }),
      ]);

      // Complete transactions
      await Promise.all([
        this.transactionService.completeTransaction(fromTransaction.id),
        this.transactionService.completeTransaction(toTransaction.id),
      ]);

      // Update trade status to completed
      return this.tradeRepository.update(tradeId, {
        status: TradeStatus.COMPLETED,
      });
    } catch (error) {
      // If anything fails, mark the trade as failed
      await this.tradeRepository.update(tradeId, {
        status: TradeStatus.FAILED,
      });
      throw error;
    }
  }

  async cancelTrade(tradeId: string): Promise<Trade> {
    const trade = await this.findById(tradeId);

    if (trade.status !== TradeStatus.PENDING) {
      throw new BadRequestException(`Trade is already ${trade.status}`);
    }

    return this.tradeRepository.update(tradeId, { status: TradeStatus.FAILED });
  }
}
