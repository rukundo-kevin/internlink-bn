import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { InternshipController, StudentController } from './student.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [CloudinaryModule, EmailModule],
  providers: [StudentService],
  controllers: [StudentController, InternshipController],
})
export class StudentModule {}
