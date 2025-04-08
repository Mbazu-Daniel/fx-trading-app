import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    example: 'USD',
    description: 'Three-letter currency code following ISO 4217 format',
    maxLength: 3,
    minLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'Code must be exactly 3 characters long' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'US Dollar',
    description: 'Full name of the currency',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the currency is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
