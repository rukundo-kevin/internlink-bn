import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/guard/user.decorator';
import { Prisma, ROLE_ENUM, Student, User as UserType } from '@prisma/client';
import { Public } from 'src/guard/guard.decorator';
import { createEducationDto, createExperienceDto } from './dto/student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from 'src/email/email.service';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private cloudinaryService: CloudinaryService,
    private emailService: EmailService,
  ) {}

  @Post()
  async createStudent() {
    return this.studentService.createStudent();
  }

  @Get('/')
  async getStudent() {
    return this.studentService.getStudent({});
  }

  @Get('/internship')
  async getStudentInternship(
    @User()
    user: UserType,
    @Query() query: any,
  ) {
    let filters: Prisma.InternshipWhereInput = {};
    if (user.role === ROLE_ENUM.STUDENT) {
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
    const internships = await this.studentService.getInternships(filters, user);
    return internships;
  }

  @Post('/internship/:id/apply')
  async applyInternship(
    @User() user: UserType,
    @Body() data: { comment: string },
    @Param() id: any,
  ) {
    const application = await this.studentService.makeApplication(
      user,
      id?.id,
      data?.comment,
    );

    const internship = application.internship.title;
    await this.emailService.sendNewApplication(
      {
        email: user?.email,
        name: user?.firstName,
      },
      internship,
    );

    return application;
  }

  @Get('/internship/:id/applications')
  async getInternshipApplication(@Param('id') id: any) {
    const application = await this.studentService.getApplications({
      internship: {
        id: Number(id),
      },
    });
    return application;
  }

  @Get('/applications')
  async getApplication(@User() user: UserType) {
    let filters: Prisma.ApplicationWhereInput;
    if (user.role === ROLE_ENUM.STUDENT) {
      filters = {
        student: {
          userId: user.id,
        },
      };
    }

    const application = await this.studentService.getApplications(filters);
    return application;
  }

  @Patch('/applications/:id/accept')
  async acceptApplication(@Param('id') id: any) {
    const application = await this.studentService.updateApplication(id, {
      state: 'APPROVED',
    });

    const student = application.student.user;
    const internship = application.internship.title;

    await this.emailService.approveOrRejectApplication(
      {
        email: student.email,
        name: student.firstName,
      },
      'APPROVED',
      internship,
    );

    return application;
  }

  @Patch('/applications/:id/reject')
  async rejectApplication(@Param('id') id: any) {
    const application = await this.studentService.updateApplication(id, {
      state: 'REJECTED',
    });
    const student = application.student.user;
    const internship = application.internship.title;

    await this.emailService.approveOrRejectApplication(
      {
        email: student.email,
        name: student.firstName,
      },
      'REJECTED',
      internship,
    );

    return application;
  }

  @Post('/evaluation')
  async createEvaluation(
    @User()
    user: UserType & {
      students: Student[];
    },
    @Body()
    data: {
      score: number;
      comment: string;
      studentId: number;
      applicationId: number;
    },
  ) {
    const evaluationData: Prisma.EvaluationCreateInput = {
      comment: data.comment,
      score: Number(data.score),
      application: {
        connect: {
          id: data.applicationId,
        },
      },
      supervisor: {
        connect: {
          id: user.id,
        },
      },
    };
    return this.studentService.createEvaluation(evaluationData);
  }

  @Delete('/evaluation/:id')
  async deleteEvaluation(@Param('id') id: any) {
    return await this.studentService.deleteEvaluation(Number(id));
  }

  @Get('/evaluation')
  async getEvaluation(
    @User()
    user: UserType,
  ) {
    let filter: Prisma.EvaluationWhereInput;
    if (user?.role == 'STUDENT') {
      filter = {
        application: {
          student: {
            userId: user.id,
          },
        },
      };
    } else if (user?.role == 'SUPERVISOR') {
      filter = {
        supervisor: {
          id: user.id,
        },
      };
    }
    const evaluation = await this.studentService.getEvaluation(filter);
    return evaluation;
  }

  @Post('/education')
  async createEducation(
    @User()
    user: UserType & {
      students: Student[];
    },
    @Body() data: createEducationDto,
  ) {
    const educationData: Prisma.EducationCreateInput = {
      startDate: data.startDate,
      endDate: data.endDate,
      school: data.school,
      degree: data.degree,
      department: data.fieldofstudy,
      grade: data.grade,
      student: {
        connect: {
          id: user?.students[0]?.id,
        },
      },
    };
    return this.studentService.createEducation(educationData);
  }

  @Post('/experience')
  async createExperience(
    @User()
    user: UserType & {
      students: Student[];
    },
    @Body() data: createExperienceDto,
  ) {
    const experienceData: Prisma.ExperienceCreateInput = {
      title: data.title,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      location: data.location,
      student: {
        connect: {
          id: user?.students[0]?.id,
        },
      },
    };
    return this.studentService.createExperience(experienceData);
  }

  @Post('/certificate')
  @UseInterceptors(FileInterceptor('certificate'))
  async createCertificate(
    @User()
    user: UserType & {
      students: Student[];
    },
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { url } = await this.cloudinaryService.uploadImage(file);

    const certificateData: Prisma.CertificateCreateInput = {
      title: data.title,
      organization: data.organization,
      description: data.description,
      documentUrl: url,
      student: {
        connect: {
          id: user?.students[0]?.id,
        },
      },
    };

    return this.studentService.createCertificate(certificateData);
  }

  @Patch('/resume')
  @UseInterceptors(FileInterceptor('resume'))
  async updateResume(
    @User()
    user: UserType & {
      students: Student[];
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const resume = await this.cloudinaryService.uploadImage(file);

    const updatedStudent = await this.studentService.updateStudent(
      {
        resumeUrl: resume.url,
        resumeName: file?.originalname,
      },
      user?.students[0]?.id,
    );

    return updatedStudent;
  }

  @Patch('/update-profile-pic')
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateProfilePic(
    @User()
    user: UserType & {
      students: Student[];
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photo = await this.cloudinaryService.uploadImage(file);

    const updatedStudent = await this.studentService.updateStudent(
      {
        photoUrl: photo.url,
      },
      user?.students[0]?.id,
    );

    return updatedStudent;
  }

  @Get('/education')
  async getEducation(
    @User()
    user: UserType & {
      students: Student[];
    },
  ) {
    return this.studentService.getEducation({
      student: {
        id: user?.students[0]?.id,
      },
    });
  }

  @Get('/experience')
  async getExperience(
    @User()
    user: UserType & {
      students: Student[];
    },
  ) {
    return this.studentService.getExperience({
      student: {
        id: user?.students[0]?.id,
      },
    });
  }

  @Get('/certificate')
  async getCertificate(
    @User()
    user: UserType & {
      students: Student[];
    },
  ) {
    return this.studentService.getCertificate({
      student: {
        id: user?.students[0]?.id,
      },
    });
  }

  @Get('/resume')
  async getResume(
    @User()
    user: UserType & {
      students: Student[];
    },
  ) {
    const student = await this.studentService.getStudent({
      id: user?.students[0]?.id,
    });

    return [
      {
        resumeUrl: student[0]?.resumeUrl,
        resumeName: student[0]?.resumeName,
      },
    ];
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
