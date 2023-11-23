// email.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(
    user: {
      email: string;
      name: string;
    },
    token: string,
  ) {
    const confirmation_url = `http://localhost:5173/activate?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Save Street Children"',
      subject: 'Welcome to save street children! Confirm your Email',
      template: './register',
      context: {
        name: user.name,
        confirmation_url,
      },
    });
  }
  async sendForgotPassword(
    user: {
      email: string;
      name: string;
    },
    token: string,
  ) {
    const link = `http://localhost:5173/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Save Street Children"',
      subject: 'Reset Password',
      template: './forgot-password',
      context: {
        name: user.name,
        link,
      },
    });
  }
}
