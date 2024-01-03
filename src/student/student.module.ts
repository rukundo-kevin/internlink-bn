import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { InternshipController, StudentController } from './student.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [StudentService],
  controllers: [StudentController, InternshipController],
})
export class StudentModule {}
