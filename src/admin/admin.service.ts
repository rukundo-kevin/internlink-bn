import { Injectable, BadRequestException, Post } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user/user.repository';
import { createUserDto } from './dto/user.dto';
import { Password } from 'src/auth/helpers/password';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { JwtHelperService } from 'src/jwt-helper/jwt-helper.service';
import { EmailService } from 'src/email/email.service';
import { createInternshipDto } from 'src/student/dto/student.dto';

@Injectable()
export class AdminService {
  constructor(
    private userRepository: UserRepository,
    private prismaService: PrismaService,
    private jwtHelperService: JwtHelperService,
    private emailService: EmailService,
  ) {}

  async createUser(data: createUserDto) {
    try {
      const password = await Password.generateRandomPassword();

      const username = `${data.firstname} ${data.lastname}`;
      const user = await this.userRepository.createUser(
        {
          username,
          password: password,
          role: data.role,
          gender: data.gender,
          telephone: data.telephone,
          email: data.email,
          firstName: data.firstname,
          lastName: data.lastname,
        },
        false,
      );

      const activationToken = await this.jwtHelperService.generateAuthTokens(
        user.id,
      );
      await this.emailService.sendUserWelcome(
        {
          email: user.email,
          name: user.username,
          password
        },
        activationToken.accessToken,
      );

      return user;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getUsers(filters?: Prisma.UserWhereInput) {
    const users = await this.userRepository.getUsers({
      ...filters,
    });

    return users;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.deleteUser(userId);
    return user;
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput) {
    const user = await this.userRepository.updateUser(userId, data);
    console.log(data)
    console.log(user)
    return user;
  }

  async createInternship(
    data: createInternshipDto & {
      internshipPhoto?: string;
      internshipFile?: string;
    },
  ) {
    try {
      const internship = await this.prismaService.internship.create({
        data: {
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          photoUrl: data.internshipPhoto,
          durationUnit: data.unit,
          duration: data.duration,
          documentUrl: data.internshipFile,
          startDate: data.startDate,
          department: data.department,
        },
      });

      return internship;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating internship');
    }
  }

  async deleteInternship(id: number) {
    const internship = await this.prismaService.internship.delete({
      where: {
        id: Number(id),
      },
    });
    return internship;
  }
}
