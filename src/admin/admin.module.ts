import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { repositoryModule } from 'src/repositories/repository.module';
import { EmailModule } from 'src/email/email.module';
import { JwtHelperModule } from 'src/jwt-helper/jwt-helper.module';

@Module({
  imports: [repositoryModule, EmailModule, JwtHelperModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
