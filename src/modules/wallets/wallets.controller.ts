import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IAuthenticatedUserRequest } from 'src/common/interfaces';
import { CreateTradeDto } from '../trades/dto/create-trade.dto';
import { TradesService } from '../trades/trades.service';
import { TransactionsService } from '../transactions/transactions.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { WalletsService } from './wallets.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService,
    private readonly transactionService: TransactionsService,
    private readonly tradeService: TradesService,
  ) {}

  @Get()
  async getUserWallets(@CurrentUser() req: IAuthenticatedUserRequest) {
    return this.walletService.getUserWallets(req.auth.principalId);
  }

  @Post('fund')
  async fundWallet(
    @CurrentUser() req: IAuthenticatedUserRequest,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    const transaction = await this.transactionService.createDeposit(
      req.auth.principalId,
      fundWalletDto.currencyId,
      fundWalletDto.amount,
      fundWalletDto.description,
    );

    // In a real application, we would typically integrate with a payment processor here like paystack or stripe etc
    // For this demo purposes, we'll just mark the transaction as completed
    return this.transactionService.completeTransaction(transaction.id);
  }

  @Post('transfer')
  async transferFunds(
    @CurrentUser() req: IAuthenticatedUserRequest,
    @Body() transferFundsDto: TransferFundsDto,
  ) {
    // Create transfer transactions
    const { senderTransaction } = await this.transactionService.createTransfer(
      req.auth.principalId,
      transferFundsDto.recipientId,
      transferFundsDto.currencyId,
      transferFundsDto.amount,
      transferFundsDto.description,
    );

    // Complete the transfer immediately
    // Extract the base reference without the -SND suffix
    const transferReference = senderTransaction.reference.slice(0, -4);
    return this.transactionService.completeTransfer(transferReference);
  }

  @Post('convert')
  async convertCurrency(
    @CurrentUser() req: IAuthenticatedUserRequest,
    @Body() convertCurrencyDto: ConvertCurrencyDto,
  ) {
    // Create a trade with the specified conversion details
    const trade = await this.tradeService.createTrade(req.auth.principalId, {
      fromCurrencyId: convertCurrencyDto.fromCurrencyId,
      toCurrencyId: convertCurrencyDto.toCurrencyId,
      fromAmount: convertCurrencyDto.amount,
      rate: convertCurrencyDto.rate,
    });

    // Execute the trade immediately
    return this.tradeService.executeTrade(trade.id);
  }

  @Post('trade')
  async tradeCurrencies(
    @CurrentUser() req: IAuthenticatedUserRequest,
    @Body() createTradeDto: CreateTradeDto,
  ) {
    // Create the trade
    const trade = await this.tradeService.createTrade(
      req.auth.principalId,
      createTradeDto,
    );

    // Execute the trade immediately
    return this.tradeService.executeTrade(trade.id);
  }
}
