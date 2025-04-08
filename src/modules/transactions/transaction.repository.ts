import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/common/database/entities';
import { BaseRepository } from 'src/common/repositories';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {
    super(transactionRepository);
  }

  async findByReference(reference: string): Promise<Transaction | undefined> {
    return this.transactionRepository.findOne({ where: { reference } });
  }

  async findUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: ['wallet', 'wallet.currency'],
      order: { createdAt: 'DESC' },
    });
  }
}
