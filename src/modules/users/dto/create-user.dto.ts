import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/enums';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsDateString()
  verifiedAt?: Date;

  @IsOptional()
  @IsString()
  otpCode?: string;

  @IsOptional()
  @IsDateString()
  otpExpiresAt?: Date;
}
