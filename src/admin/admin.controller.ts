import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Post,
  ParseIntPipe,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/guard/guard.decorator';
import { ROLE_ENUM } from '@prisma/client';
import { createUserDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';
import { createInternshipDto } from 'src/student/dto/student.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
@Roles(ROLE_ENUM.ADMIN)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private emailService: EmailService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post('/')
  async createUser(@Body() userDto: createUserDto) {
    const user = await this.adminService.createUser(userDto);

    return user;
  }

  @Get('/')
  async getUsers() {
    const users = await this.adminService.getUsers();
    return users;
  }

  @Delete('/:userId')
  async deleteUser(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    const user = await this.adminService.deleteUser(userId);
    return user;
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe)
    userId: number,
    @Body() data: any,
  ) {
    const user = await this.adminService.updateUser(userId, data);
    return user;
  }

  @Get('/supervisors')
  async getSupervisors() {
    const supervisors = await this.adminService.getUsers({
      role: ROLE_ENUM.SUPERVISOR,
    });
    return supervisors;
  }

  @Post('/internship')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'internshipFile', maxCount: 1 },
      { name: 'internshipPhoto', maxCount: 1 },
    ]),
  )
  async createInternship(
    @Body() body: createInternshipDto,
    @UploadedFiles()
    files: {
      internshipFile: Express.Multer.File[];
      internshipPhoto: Express.Multer.File[];
    },
  ) {
    const internshipFile = await this.cloudinary.uploadImage(
      files.internshipFile[0],
    );
    const internshipPhoto = await this.cloudinary.uploadImage(
      files.internshipPhoto[0],
    );

    const createdInternship = await this.adminService.createInternship({
      ...body,
      internshipFile: internshipFile.url,
      internshipPhoto: internshipPhoto.url,
    });

    return createdInternship;
  }

  @Delete('internship/:id')
  async deleteInternship(@Param('id') id: number) {
    const internship = await this.adminService.deleteInternship(id);
    return internship;
  }
}
