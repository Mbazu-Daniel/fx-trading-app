import { User } from '../database/entities';

export default class OtpHelper {
  static generate(): { otpCode: string; otpExpiresAt: Date } {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return { otpCode, otpExpiresAt };
  }

  static verify(user: User, providedOtp: string): boolean {
    if (!user.otpCode || !user.otpExpiresAt) {
      return false;
    }

    const now = new Date();

    return user.otpCode === providedOtp && now < user.otpExpiresAt;
  }

  static isOtpValid(otpExpiry: Date): boolean {
    return new Date() < otpExpiry;
  }
}
