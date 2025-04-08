import { IsEmail, IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'OTP must be 6 digits' })
  otp: string;
}
