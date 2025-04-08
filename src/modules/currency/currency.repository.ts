import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyRepository extends BaseRepository<Currency> {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository);
  }

  async findByCode(code: string): Promise<Currency | undefined> {
    return this.currencyRepository.findOne({ where: { code } });
  }

  async findActiveCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.find({ where: { isActive: true } });
  }
}
