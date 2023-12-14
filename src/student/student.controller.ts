import { Controller, Get, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent() {
    return this.studentService.createStudent();
  }

  @Get('/')
  async getStudent() {
    return this.studentService.getStudent({});
  }
}
