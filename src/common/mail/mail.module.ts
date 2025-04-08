import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ENVIRONMENT } from '../config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: ENVIRONMENT.MAILER.USERNAME,
          pass: ENVIRONMENT.MAILER.PASSWORD,
        },
      },
      defaults: {
        from: `${ENVIRONMENT.MAILER.EMAIL}`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
