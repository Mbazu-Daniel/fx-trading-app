import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { ExchangeRateService } from './exchange-rate.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('exchange')
@ApiBearerAuth('access-token')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('rates')
  @Public()
  async getAllRates() {
    return this.exchangeRateService.getAllRates();
  }
}
