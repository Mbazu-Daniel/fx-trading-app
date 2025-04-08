import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/common/config';
import { MailModule } from 'src/common/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: ENVIRONMENT.JWT.ACCESS_SECRET,
      signOptions: { expiresIn: ENVIRONMENT.JWT.ACCESS_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
