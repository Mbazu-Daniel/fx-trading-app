import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class ConvertCurrencyDto {
  @ApiProperty({ description: 'UUID of the currency to convert from' })
  @IsUUID()
  fromCurrencyId: string;

  @ApiProperty({ description: 'UUID of the currency to convert to' })
  @IsUUID()
  toCurrencyId: string;

  @ApiProperty({ description: 'Amount to convert', example: 200.75 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Exchange rate to be used for conversion',
    example: 1.13,
  })
  @IsNumber()
  @IsPositive()
  rate: number;
}
