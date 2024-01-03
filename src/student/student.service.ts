import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
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
        education: true,
        experience: true,
        certificates: true,
        applications: {
          include: {
            internship: true,
          },
        },
      },
    });
    return students;
  }

  async updateStudent(data: Prisma.StudentUpdateInput, studentId: number) {
    try {
      const student = await this.prisma.student.update({
        where: {
          id: studentId,
        },
        data,
      });
      return student;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException('Problem updating data');
    }
  }

  async deleteStudent(id: number) {
    const student = await this.prisma.student.delete({
      where: {
        id,
      },
    });

    return student;
  }

  async getInternships(filters?: Prisma.InternshipWhereInput) {
    const internships = await this.prisma.internship.findMany({
      where: filters,
      include: {
        applications: true,
      },
    });
    return internships;
  }

  async createEducation(data: Prisma.EducationCreateInput) {
    try {
      const education = await this.prisma.education.create({
        data,
      });
      return education;
    } catch (error: any) {
      console.log(error);
      throw new Error('Problem creating education');
    }
  }

  async getEducation(filter?: Prisma.EducationWhereInput) {
    const education = await this.prisma.education.findMany({
      where: filter,
    });
    return education;
  }

  async getExperience(filter?: Prisma.ExperienceWhereInput) {
    const experience = await this.prisma.experience.findMany({
      where: filter,
    });
    return experience;
  }

  async getCertificate(filter?: Prisma.CertificateWhereInput) {
    const certificate = await this.prisma.certificate.findMany({
      where: filter,
    });
    return certificate;
  }

  async createExperience(data: Prisma.ExperienceCreateInput) {
    const experience = await this.prisma.experience.create({
      data,
    });
    return experience;
  }

  async createCertificate(data: Prisma.CertificateCreateInput) {
    const certificate = await this.prisma.certificate.create({
      data,
    });
    return certificate;
  }
}
