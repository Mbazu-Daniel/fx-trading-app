import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums';
import {
  CommonHelper,
  DbTransactionHelper,
  OtpHelper,
  PasswordHelper,
} from 'src/common/helpers';
import { MailService } from 'src/modules/mail/mail.service';
import { CurrencyService } from '../currency/currency.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly currencyService: CurrencyService,
    private readonly walletService: WalletsService,
  ) {}

  async register(email: string, password: string): Promise<boolean> {
    return DbTransactionHelper.execute(async () => {
      const normalizedEmail = CommonHelper.trimAndLowerCase(email);

      const [hashedPassword, emailExist] = await Promise.all([
        PasswordHelper.hashPassword(password),
        this.userService.findByEmail(normalizedEmail),
      ]);

      if (emailExist) {
        throw new BadRequestException('Email already exists');
      }

      const { otpCode, otpExpiresAt } = OtpHelper.generate();

      const user = await this.userService.create({
        email: normalizedEmail,
        password: hashedPassword,
        role: UserRole.BASIC,
        otpCode,
        otpExpiresAt,
      });

      const [ngn, usd] = await Promise.all([
        this.currencyService.getCurrencyByCode('NGN'),
        this.currencyService.getCurrencyByCode('USD'),
      ]);

      if (ngn) {
        await this.walletService.create(user.id, {
          currencyId: ngn.id,
          balance: 0,
        });
      }

      if (usd) {
        await this.walletService.create(user.id, {
          currencyId: usd.id,
          balance: 0,
        });
      }

      const template = `<p>Welcome! Please verify your account using the OTP ${otpCode} sent to your email. It expires in 10 minutes.</p>`;

      // Send the email after committing the transaction
      this.mailService.sendEmail(email, 'Verify Account', template);

      return true;
    });
  }
  async verifyEmail(email: string, otp: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.userService.update(user.id, {
      verifiedAt: new Date(),
      otpCode: null,
      otpExpiresAt: null,
    });

    return true;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.verifiedAt) {
      throw new BadRequestException(
        'Invalid credentials or email not verified',
      );
    }

    const isPasswordValid = await PasswordHelper.verifyPassword(
      user.password,
      password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    return { token };
  }
}
