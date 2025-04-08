import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FundWalletDto {
  @ApiProperty({
    description: 'ID of the currency wallet to fund',
    example: 'usd-wallet-123',
  })
  @IsString()
  @IsNotEmpty()
  currencyId: string;

  @ApiProperty({
    description: 'Amount to fund the wallet with',
    example: 100.5,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional description for the transaction',
    example: 'Funding wallet for monthly budget',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
