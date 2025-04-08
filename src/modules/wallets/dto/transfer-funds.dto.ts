import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class TransferFundsDto {
  @ApiProperty({ description: 'UUID of the recipient user' })
  @IsUUID()
  recipientId: string;

  @ApiProperty({
    description: 'UUID of the currency to be used for the transfer',
  })
  @IsUUID()
  currencyId: string;

  @ApiProperty({ description: 'Amount to transfer', example: 100.5 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional transaction description',
    example: 'Payment for services',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
