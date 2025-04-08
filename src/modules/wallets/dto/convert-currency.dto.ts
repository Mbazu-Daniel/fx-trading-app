import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class ConvertCurrencyDto {
  @ApiProperty({ description: 'Amount to convert', example: 100 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Source currency ID', example: 'USD' })
  @IsUUID()
  sourceCurrencyId: string;

  @ApiProperty({ description: 'Target currency ID', example: 'EUR' })
  @IsUUID()
  targetCurrencyId: string;
}
