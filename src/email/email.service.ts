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
      password?: string;
    },
    token: string,
  ) {
    const confirmation_url = `http://localhost:5173/activate?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Internship Offer Management System"',
      subject:
        'Welcome to Internship Offer Management System! Confirm your Email',
      template: './register',
      context: {
        name: user.name,
        password: user.password,
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
      from: '"Internship Offer Management System"',
      subject: 'Reset Password',
      template: './forgot-password',
      context: {
        name: user.name,
        link,
      },
    });
  }

  async sendNewApplication(
    user: { email: string; name: string },
    internship_name: string,
  ) {
    const link = `http://localhost:5173/login`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Internship Offer Management System"',
      subject: 'New Application',
      template: './new-application',
      context: {
        name: user.name,
        internship_name,
        link,
      },
    });
  }

  async approveOrRejectApplication(
    user: {
      email: string;
      name: string;
    },
    reason: string,
    internship_name: string,
  ) {
    const link = `http://localhost:5173/login`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '" Internship Offer Management System  "',
      subject: `Application ${
        reason == 'APPROVED' ? 'Accepted' : 'Rejected'
      } - Internship Offer Management System `,
      template:
        reason == 'APPROVED' ? './approve-application' : './reject-application',
      context: {
        name: user.name,
        link,
        internship_name,
      },
    });
  }
}
