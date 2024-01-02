import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { InternshipController, StudentController } from './student.controller';

@Module({
  providers: [StudentService],
  controllers: [StudentController, InternshipController],
})
export class StudentModule {}
