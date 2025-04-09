import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { ExchangeRateService } from './exchange-rate.service';

@Controller('exchange')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('rates')
  @Public()
  async getAllRates() {
    return this.exchangeRateService.getAllRates();
  }
}
