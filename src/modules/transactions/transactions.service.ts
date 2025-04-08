// src/services/transaction.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionStatus, TransactionType } from 'src/common/enums';
import { CommonHelper } from 'src/common/helpers';
import { WalletsService } from '../wallets/wallets.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletsService,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }

    return transaction;
  }

  async getByReference(reference: string): Promise<Transaction> {
    const transaction =
      await this.transactionRepository.findByReference(reference);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with reference ${reference} not found`,
      );
    }
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findUserTransactions(userId);
  }

  async createDeposit(
    userId: string,
    currencyId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    const wallet = await this.walletService.getOrCreateWallet(
      userId,
      currencyId,
    );

    const transaction = await this.transactionRepository.create({
      userId,
      walletId: wallet.id,
      amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      description: description || 'Deposit to wallet',
      reference: `DEP-${CommonHelper.generateRandomReference()}`,
    });

    return transaction;
  }

  async createWithdrawal(
    userId: string,
    currencyId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be greater than zero',
      );
    }

    const wallet = await this.walletService.getOrCreateWallet(
      userId,
      currencyId,
    );

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const transaction = await this.transactionRepository.create({
      userId,
      walletId: wallet.id,
      amount,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      description: description || 'Withdrawal from wallet',
      reference: `WDR-${CommonHelper.generateRandomReference()}`,
    });

    return transaction;
  }

  async createTransfer(
    senderId: string,
    recipientId: string,
    currencyId: string,
    amount: number,
    description?: string,
  ): Promise<{
    senderTransaction: Transaction;
    recipientTransaction: Transaction;
  }> {
    if (amount <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero',
      );
    }

    if (senderId === recipientId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    // Get or create wallets for both sender and recipient
    const [senderWallet, recipientWallet] = await Promise.all([
      this.walletService.getOrCreateWallet(senderId, currencyId),
      this.walletService.getOrCreateWallet(recipientId, currencyId),
    ]);

    // Check if sender has sufficient balance
    if (Number(senderWallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance for transfer');
    }

    // Generate a unique transfer reference
    const transferReference = `TRF-${CommonHelper.generateRandomReference()}`;

    const [senderTransaction, recipientTransaction] = await Promise.all([
      // Create sender's transaction (debit)
      this.transactionRepository.create({
        userId: senderId,
        walletId: senderWallet.id,
        amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        description: description || `Transfer to user ${recipientId}`,
        reference: `${transferReference}-SND`,
      }),
      // Create recipient's transaction (credit)
      this.transactionRepository.create({
        userId: recipientId,
        walletId: recipientWallet.id,
        amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        description: description || `Transfer from user ${senderId}`,
        reference: `${transferReference}-RCV`,
      }),
    ]);

    return { senderTransaction, recipientTransaction };
  }

  async createTransaction(
    walletId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Validate wallet exists
    await this.walletService.getWalletById(walletId);

    // Generate reference if not provided
    const reference =
      createTransactionDto.reference ||
      `TXN-${CommonHelper.generateRandomReference()}`;

    return this.transactionRepository.create({
      ...createTransactionDto,
      reference,
    });
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    await this.getTransactionById(transactionId);
    return this.transactionRepository.update(
      transactionId,
      updateTransactionDto,
    );
  }

  async completeTransaction(transactionId: string): Promise<Transaction> {
    const transaction = await this.getTransactionById(transactionId);

    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Transaction is already completed');
    }

    if (transaction.status === TransactionStatus.FAILED) {
      throw new BadRequestException('Failed transactions cannot be completed');
    }

    // Update wallet balance based on transaction type
    if (transaction.type === TransactionType.DEPOSIT) {
      await this.walletService.updateBalance(
        transaction.walletId,
        Number(transaction.amount),
      );
    } else if (transaction.type === TransactionType.WITHDRAWAL) {
      await this.walletService.updateBalance(
        transaction.walletId,
        -Number(transaction.amount),
      );
    } else if (transaction.type === TransactionType.TRANSFER) {
      // For transfers, we need to check if this is a sender or recipient transaction
      if (transaction.reference.endsWith('-SND')) {
        // Sender transaction, deduct amount
        await this.walletService.updateBalance(
          transaction.walletId,
          -Number(transaction.amount),
        );
      } else if (transaction.reference.endsWith('-RCV')) {
        // Recipient transaction, add amount
        await this.walletService.updateBalance(
          transaction.walletId,
          Number(transaction.amount),
        );
      }
    }

    // Update transaction status
    return this.transactionRepository.update(transactionId, {
      status: TransactionStatus.COMPLETED,
    });
  }

  async completeTransfer(transferReference: string): Promise<{
    senderTransaction: Transaction;
    recipientTransaction: Transaction;
  }> {
    // Find both sender and recipient transactions
    const [senderTransaction, recipientTransaction] = await Promise.all([
      this.transactionRepository.findByReference(`${transferReference}-SND`),
      this.transactionRepository.findByReference(`${transferReference}-RCV`),
    ]);

    if (!senderTransaction || !recipientTransaction) {
      throw new NotFoundException(
        `Transfer with reference ${transferReference} not found`,
      );
    }

    // Complete both transactions
    const [completedSenderTransaction, completedRecipientTransaction] =
      await Promise.all([
        this.completeTransaction(senderTransaction.id),
        this.completeTransaction(recipientTransaction.id),
      ]);

    return {
      senderTransaction: completedSenderTransaction,
      recipientTransaction: completedRecipientTransaction,
    };
  }

  async failTransaction(
    transactionId: string,
    reason?: string,
  ): Promise<Transaction> {
    const transaction = await this.getTransactionById(transactionId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Only pending transactions can be failed');
    }

    return this.transactionRepository.update(transactionId, {
      status: TransactionStatus.FAILED,
      description: reason
        ? `${transaction.description || ''} - Failed: ${reason}`
        : transaction.description,
    });
  }

  async failTransfer(
    transferReference: string,
    reason?: string,
  ): Promise<{
    senderTransaction: Transaction;
    recipientTransaction: Transaction;
  }> {
    // Find both sender and recipient transactions
    const [senderTransaction, recipientTransaction] = await Promise.all([
      this.transactionRepository.findByReference(`${transferReference}-SND`),
      this.transactionRepository.findByReference(`${transferReference}-RCV`),
    ]);

    if (!senderTransaction || !recipientTransaction) {
      throw new NotFoundException(
        `Transfer with reference ${transferReference} not found`,
      );
    }

    // Fail both transactions
    const [failedSenderTransaction, failedRecipientTransaction] =
      await Promise.all([
        this.failTransaction(senderTransaction.id, reason),
        this.failTransaction(recipientTransaction.id, reason),
      ]);

    return {
      senderTransaction: failedSenderTransaction,
      recipientTransaction: failedRecipientTransaction,
    };
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    await this.transactionRepository.softDelete(transactionId);
  }
}
