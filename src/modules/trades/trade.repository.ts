import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories';
import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';

@Injectable()
export class TradeRepository extends BaseRepository<Trade> {
  constructor(
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
  ) {
    super(tradeRepository);
  }

  async findByReference(reference: string): Promise<Trade | undefined> {
    return this.tradeRepository.findOne({ where: { reference } });
  }

  async findUserTrades(userId: string): Promise<Trade[]> {
    return this.tradeRepository.find({
      where: { userId },
      relations: ['fromCurrency', 'toCurrency'],
      order: { createdAt: 'DESC' },
    });
  }
}
