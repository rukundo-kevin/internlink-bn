import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user/user.repository';
import { createUserDto } from './dto/user.dto';
import { Password } from 'src/auth/helpers/password';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { JwtHelperService } from 'src/jwt-helper/jwt-helper.service';
import { EmailService } from 'src/email/email.service';

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
      const hashedPassword = await Password.hashPassword(
        await Password.generateRandomPassword(),
        10,
      );
      const username = `${data.firstname} ${data.lastname}`;
      delete data.firstname;
      delete data.lastname;
      const user = await this.userRepository.createUser({
        username,
        password: hashedPassword,
        role: data.role,
        gender: data.gender,
        telephone: data.telephone,
        email: data.email,
      });

      if (data.role === 'POLICE') {
        await this.prismaService.police.create({
          data: {
            province: data.province,
            district: data.district,
            sector: data.sector,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        await this.prismaService.districtAuthority.create({
          data: {
            district: data.district,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      const activationToken = await this.jwtHelperService.generateAuthTokens(
        user.id,
      );
      await this.emailService.sendUserWelcome(
        {
          email: user.email,
          name: user.username,
        },
        activationToken.accessToken,
      );

      return user;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Error creating user');
    }
  }

  async getUsers() {
    const users = await this.userRepository.getUsers();
    return users;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.deleteUser(userId);
    return user;
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput) {
    const user = await this.userRepository.updateUser(userId, data);
    return user;
  }
}
