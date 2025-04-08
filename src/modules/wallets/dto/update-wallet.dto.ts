import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWalletDto {
  @ApiPropertyOptional({
    description: 'Updated balance for the wallet',
    example: 100.25,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0)
  balance?: number;
}
