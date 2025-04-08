import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from 'src/common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
