import { randomBytes } from 'crypto';

export default class CommonHelper {
  static trimAndLowerCase(value: string): string {
    return value.trim().toLowerCase();
  }

  static generateOTP(length = 6): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  static generateRandomReference(length: number = 16): string {
    return randomBytes(length).toString('hex');
  }
}
