import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min
} from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ description: 'Currency ID for the wallet', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  currencyId: string;

  @ApiPropertyOptional({
    description: 'Initial balance for the wallet',
    example: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0)
  balance?: number;
}
