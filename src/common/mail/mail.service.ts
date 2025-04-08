import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ENVIRONMENT } from '../config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(toEmail: string, subject: string, template: string) {
    try {
      await this.mailerService.sendMail({
        from: `No Reply <${ENVIRONMENT.MAILER.EMAIL}>`,
        to: toEmail,
        subject: subject,
        html: template,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error sending email. Please try again later.',
        error,
      );
    }
  }
}
