import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Password } from 'src/auth/helpers/password';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}
  async createUser(data: any): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username: data.username,
          },
          {
            email: data.email,
          },
        ],
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await Password.hashPassword(data.password, 10);

    return await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async getUserId(userId: number): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { id: userId },
      include: {
        students: {
          include: {
            applications: true,
            education: true,
            experience: true,
            certificates: true,
          },
        },
      },
    });
  }

  async getUsers(filter?: Prisma.UserWhereInput): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: {
        NOT: {
          role: 'ADMIN',
        },
        ...filter,
      },
      include: {
        students: {
          include: {
            applications: true,
            education: true,
            experience: true,
            certificates: true,
          },
        },
      },
    });
  }

  async deleteUser(userId: number): Promise<User> {
    return await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async updateUser(
    userId: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });
  }
}
