import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCurrencyDto {
  @ApiPropertyOptional({
    example: 'EUR',
    description: 'Three-letter currency code following ISO 4217 format',
    maxLength: 3,
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Code must be exactly 3 characters long' })
  code?: string;

  @ApiPropertyOptional({
    example: 'Euro',
    description: 'Full name of the currency',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates if the currency is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
