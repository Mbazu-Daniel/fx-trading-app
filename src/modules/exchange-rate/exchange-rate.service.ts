import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ENVIRONMENT } from 'src/common/config';
import { ExchangeRate, ExchangeRateApiResponse } from 'src/common/interfaces';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class ExchangeRateService implements OnModuleInit {
  private rates: Map<string, Map<string, ExchangeRate>> = new Map();
  private readonly logger = new Logger(ExchangeRateService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string = ENVIRONMENT.EXCHANGE_RATE.BASE_URL;

  constructor(
    private readonly httpService: HttpService,
    private readonly currencyService: CurrencyService,
  ) {
    this.apiKey = ENVIRONMENT.EXCHANGE_RATE.API_KEY;
    if (!this.apiKey) {
      this.logger.warn(
        'EXCHANGE_RATE_API_KEY is not set. Exchange rate service will not work properly.',
      );
    }
  }

  async onModuleInit() {
    await this.refreshRates();
  }

  // Refresh rates every hour
  @Cron(CronExpression.EVERY_HOUR)
  async refreshRates() {
    try {
      this.logger.log('Refreshing exchange rates');
      const currencies = await this.currencyService.getActiveCurrencies();

      // Fetch rates for each base currency
      for (const currency of currencies) {
        await this.fetchRatesForCurrency(currency.code);
      }

      this.logger.log('Exchange rates refreshed successfully');
    } catch (error) {
      this.logger.error(`Failed to refresh exchange rates: ${error.message}`);
    }
  }

  private async fetchRatesForCurrency(currencyCode: string): Promise<void> {
    try {
      if (!this.apiKey) {
        throw new Error('Exchange Rate API key is not configured');
      }

      const url = `${this.baseUrl}/${this.apiKey}/latest/${currencyCode}`;
      const response = await firstValueFrom(
        this.httpService.get<ExchangeRateApiResponse>(url),
      );

      if (response.data.result !== 'success') {
        throw new Error(`API returned error: ${response.data.result}`);
      }

      // Initialize the map for this currency if it doesn't exist
      if (!this.rates.has(currencyCode)) {
        this.rates.set(currencyCode, new Map());
      }

      // Update rates for all conversion pairs
      const now = new Date();
      for (const [toCurrencyCode, rate] of Object.entries(
        response.data.conversion_rates,
      )) {
        if (currencyCode !== toCurrencyCode) {
          this.rates.get(currencyCode).set(toCurrencyCode, {
            fromCurrency: currencyCode,
            toCurrency: toCurrencyCode,
            rate,
            updatedAt: now,
          });
        }
      }

      this.logger.log(`Updated rates for ${currencyCode}`);
    } catch (error) {
      this.logger.error(
        `Failed to fetch rates for ${currencyCode}: ${error.message}`,
      );
      throw error;
    }
  }

  async getRate(
    fromCurrencyCode: string,
    toCurrencyCode: string,
  ): Promise<number> {
    // If the currency is the same, the rate is 1
    if (fromCurrencyCode === toCurrencyCode) {
      return 1;
    }

    // Try to get rate from cache
    const fromCurrencyRates = this.rates.get(fromCurrencyCode);
    if (fromCurrencyRates && fromCurrencyRates.has(toCurrencyCode)) {
      return fromCurrencyRates.get(toCurrencyCode).rate;
    }

    // If not in cache, try to fetch from API
    try {
      await this.fetchRatesForCurrency(fromCurrencyCode);

      // Check if we have the rate now
      const updatedFromCurrencyRates = this.rates.get(fromCurrencyCode);
      if (
        updatedFromCurrencyRates &&
        updatedFromCurrencyRates.has(toCurrencyCode)
      ) {
        return updatedFromCurrencyRates.get(toCurrencyCode).rate;
      }

      throw new Error(
        `Exchange rate not found for ${fromCurrencyCode} to ${toCurrencyCode}`,
      );
    } catch (error) {
      this.logger.error(`Failed to get rate: ${error.message}`);
      throw new Error(`Unable to get exchange rate: ${error.message}`);
    }
  }

  async getAllRates(): Promise<ExchangeRate[]> {
    // If rates cache is empty, refresh rates
    if (this.rates.size === 0) {
      await this.refreshRates();
    }

    const allRates: ExchangeRate[] = [];

    for (const [, toRates] of this.rates.entries()) {
      for (const rate of toRates.values()) {
        allRates.push(rate);
      }
    }

    return allRates;
  }

  async updateRate(
    fromCurrencyCode: string,
    toCurrencyCode: string,
    newRate: number,
  ): Promise<ExchangeRate> {
    // Validate currencies
    await Promise.all([
      await this.currencyService.getCurrencyByCode(fromCurrencyCode),
      await this.currencyService.getCurrencyByCode(toCurrencyCode),
    ]);

    if (newRate <= 0) {
      throw new Error('Rate must be greater than zero');
    }

    // Ensure maps exist
    if (!this.rates.has(fromCurrencyCode)) {
      this.rates.set(fromCurrencyCode, new Map());
    }

    // Update rate
    const updatedRate: ExchangeRate = {
      fromCurrency: fromCurrencyCode,
      toCurrency: toCurrencyCode,
      rate: newRate,
      updatedAt: new Date(),
    };

    this.rates.get(fromCurrencyCode).set(toCurrencyCode, updatedRate);

    return updatedRate;
  }

  async convertAmount(
    fromCurrencyCode: string,
    toCurrencyCode: string,
    amount: number,
  ): Promise<number> {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    const rate = await this.getRate(fromCurrencyCode, toCurrencyCode);
    return amount * rate;
  }
}
