import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

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

  async getInternships(filters?: Prisma.InternshipWhereInput, user?: User) {
    const internships = await this.prisma.internship.findMany({
      where: { ...filters },

      include: {
        applications: {
          include: {
            student: {
              include: {
                user: true,
                certificates: true,
                experience: true,
                education: true,
              },
            },
          },
        },
      },
    });
    console.log(internships);
    if (user?.role === 'STUDENT') {
      return internships.filter(
        (internship) => internship.applications.length !== 0,
      );
    }
    return internships;
  }

  async makeApplication(user: User, internshipId: number, comment: string) {
    try {
      const student = await this.prisma.student.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!student) throw new BadRequestException('Student not found');

      const applications = await this.prisma.application.create({
        data: {
          student: {
            connect: {
              id: Number(student.id),
            },
          },
          internship: {
            connect: {
              id: Number(internshipId),
            },
          },
          comment,
        },
        include: {
          internship: {},
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      return applications;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
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

  async getApplications(filters?: Prisma.ApplicationWhereInput) {
    const application = await this.prisma.application.findMany({
      where: filters,
      include: {
        internship: true,
        student: {
          include: {
            user: true,
            certificates: true,
            experience: true,
            education: true,
          },
        },
      },
    });
    return application;
  }

  async updateApplication(
    applicationId: number,
    data: Prisma.ApplicationUpdateInput,
  ) {
    try {
      const application = await this.prisma.application.update({
        where: {
          id: Number(applicationId),
        },
        data,
        include: {
          student: {
            include: {
              user: true,
            },
          },
          internship: true,
        },
      });
      return application;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException('Problem updating application');
    }
  }

  async createEvaluation(data: Prisma.EvaluationCreateInput) {
    try {
      const evaluation = await this.prisma.evaluation.create({
        data,
      });
      return evaluation;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException('Problem creating evaluation');
    }
  }

  async getEvaluation(filter?: Prisma.EvaluationWhereInput) {
    const evaluation = await this.prisma.evaluation.findMany({
      where: filter,
      include: {
        application: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
            internship: true,
          },
        },
        supervisor: true,
      },
    });
    return evaluation;
  }

  async deleteEvaluation(id: number) {
    const evaluation = await this.prisma.evaluation.delete({
      where: {
        id,
      },
    });
    return evaluation;
  }
}
