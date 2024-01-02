import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/guard/user.decorator';
import { Prisma, User as UserType } from '@prisma/client';
import { Public } from 'src/guard/guard.decorator';

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

  @Get('/internship')
  async getStudentInternship(@User() user: UserType, @Query() query: any) {
    let filters: Prisma.InternshipWhereInput = {};

    if (user.role === 'STUDENT') {
      filters = {
        applications: {
          every: {
            student: {
              userId: user.id,
            },
          },
        },
      };
    }

    return this.studentService.getInternships(filters);
  }
}
@Public()
@Controller('internships')
export class InternshipController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/')
  async getInternship() {
    return this.studentService.getInternships({
      status: 'OPEN',
    });
  }

  @Get('/:id')
  async getInternshipById(@Param('id') id: any) {
    const internship = await this.studentService.getInternships({
      id: Number(id),
    });

    if (!internship.length) {
      throw new NotFoundException('Internship not found');
    }

    return internship[0];
  }
}
