import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent() {}
  async getStudent(filter: Prisma.StudentWhereInput) {
    const students = await this.prisma.student.findMany({
      where: filter,
      include: {
        user: true,
      },
    });
    return students;
  }
  async updateStudent() {}
  async deleteStudent() {}

  async getInternships(filters?: Prisma.InternshipWhereInput) {
    const internships = await this.prisma.internship.findMany({
      where: filters,
      include: {
        applications: true,
      },
    });
    return internships;
  }
}
