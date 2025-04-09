import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENVIRONMENT } from 'src/common/config';
import { MailModule } from 'src/modules/mail/mail.module';
import { CurrencyModule } from '../currency/currency.module';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: ENVIRONMENT.JWT.ACCESS_SECRET,
      signOptions: { expiresIn: ENVIRONMENT.JWT.ACCESS_EXPIRES_IN },
    }),
    UsersModule,
    MailModule,
    WalletsModule,
    CurrencyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
