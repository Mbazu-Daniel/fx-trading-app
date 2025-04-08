import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums';
import { CommonHelper, OtpHelper, PasswordHelper } from 'src/common/helpers';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    // private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(email: string, password: string): Promise<boolean> {
    const normalizedEmail = CommonHelper.trimAndLowerCase(email);

    const [hashedPassword, emailExist] = await Promise.all([
      PasswordHelper.hashPassword(password),
      this.userService.findByEmail(normalizedEmail),
    ]);

    if (emailExist) {
      throw new BadRequestException('Email already exists');
    }

    const { otpCode, otpExpiresAt } = OtpHelper.generate();

    const newUser = await this.userService.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.BASIC,
      otpCode,
      otpExpiresAt,
    });

    const template = `<p>Welcome! Please verify your account using the OTP ${otpCode} sent to your email. It expires in 10 minutes.</p>`;

    await this.mailService.sendEmail(email, 'Verify Account', template);

    return !!newUser.email;
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

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    console.log(`Sending email to ${to}: ${subject} - ${text}`);
    // Replace with actual email service implementation (e.g., Nodemailer)
  }
}
