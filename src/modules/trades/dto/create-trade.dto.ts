import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateTradeDto {
  @ApiProperty({
    description: 'UUID of the source currency (from)',
    example: 'b4db1f2e-3c72-4d98-a02a-4de67f96d090',
  })
  @IsUUID()
  fromCurrencyId: string;

  @ApiProperty({
    description: 'UUID of the target currency (to)',
    example: 'e6cd72d9-2a29-4b47-bcbc-4e083a926f95',
  })
  @IsUUID()
  toCurrencyId: string;

  @ApiProperty({
    description: 'Amount to trade from the source currency',
    example: 500.0,
  })
  @IsNumber()
  @IsPositive()
  fromAmount: number;

  @ApiProperty({
    description: 'Exchange rate applied to the trade',
    example: 1.12,
  })
  @IsNumber()
  @IsPositive()
  rate: number;
}
