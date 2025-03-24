
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Platform',
      template: 'welcome',
      context: {
        email: email,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'reset-password',
      context: {
        email: email,
        resetLink: resetLink,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: './verification',
      context: {
        token,
      },
    });
  }
}
