import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { RoleGuard, Roles } from 'src/common/guards';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('currency')
@ApiBearerAuth('access-token')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getAllActiveCurrencies() {
    return this.currencyService.getActiveCurrencies();
  }

  @Get(':currencyId')
  async getCurrencyById(@Param('currencyId') currencyId: string) {
    return this.currencyService.getCurrencyById(currencyId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async createCurrency(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.createCurrency(createCurrencyDto);
  }

  @Put(':currencyId')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async updateCurrency(
    @Param('currencyId') currencyId: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currencyService.updateCurrency(currencyId, updateCurrencyDto);
  }

  @Put(':currencyId/toggle-active')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async toggleCurrencyActive(@Param('currencyId') currencyId: string) {
    return this.currencyService.toggleActive(currencyId);
  }

  @Delete(':currencyId')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async deleteCurrency(@Param('currencyId') currencyId: string) {
    await this.currencyService.delete(currencyId);
    return { message: 'Currency deleted successfully' };
  }
}
