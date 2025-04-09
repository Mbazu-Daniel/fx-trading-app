import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.findAll();
  }

  async getCurrencyById(currencyId: string): Promise<Currency> {
    const currency = await this.currencyRepository.findById(currencyId);
    if (!currency) {
      throw new NotFoundException(
        `Currency with currencyId ${currencyId} not found`,
      );
    }
    return currency;
  }

  async getCurrencyByCode(code: string): Promise<Currency> {
    const currency = await this.currencyRepository.findByCode(code);

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
    return currency;
  }

  async getActiveCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.findActiveCurrencies();
  }

  async createCurrency(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<Currency> {
    const existingCurrency = await this.currencyRepository.findByCode(
      createCurrencyDto.code,
    );
    if (existingCurrency) {
      throw new UnprocessableEntityException(
        `Currency with code ${createCurrencyDto.code} already exists`,
      );
    }

    return this.currencyRepository.create(createCurrencyDto);
  }

  async updateCurrency(
    currencyId: string,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const currency = await this.getCurrencyById(currencyId);

    if (updateCurrencyDto.code && updateCurrencyDto.code !== currency.code) {
      const existingCurrency = await this.currencyRepository.findByCode(
        updateCurrencyDto.code,
      );
      if (existingCurrency) {
        throw new Error(
          `Currency with code ${updateCurrencyDto.code} already exists`,
        );
      }
    }

    return this.currencyRepository.update(currencyId, updateCurrencyDto);
  }

  async toggleActive(currencyId: string): Promise<Currency> {
    const currency = await this.getCurrencyById(currencyId);
    return this.currencyRepository.update(currencyId, {
      isActive: !currency.isActive,
    });
  }

  async delete(currencyId: string): Promise<void> {
    await this.currencyRepository.softDelete(currencyId);
  }
}
