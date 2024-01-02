// email.module.ts

import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';

const length = __dirname.split('\\').length;
const dir = __dirname
  .split('\\')
  .slice(0, length - 3)
  .join('\\');

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: 'gmail',
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_TOKEN,
          },
        },
        defaults: {
          from: `"InternLink" `,
        },
        template: {
          dir: join(dir, 'dist/email/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [],
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
