import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { addOrgDto, loginDto, registerDto } from './dto/auth.dto';
import { Password } from './helpers/password';
import { JwtHelperService } from 'src/jwt-helper/jwt-helper.service';
import { EmailService } from 'src/email/email.service';
import { UserRepository } from 'src/repositories/user/user.repository';
import { ROLE_ENUM } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private PrismaService: PrismaService,
    private jwtHelperService: JwtHelperService,
    private emailService: EmailService,
    private userRepository: UserRepository,
  ) {}

  async loginWithUsernameOrPassword(loginInputDto: loginDto) {
    const { username, password } = loginInputDto;
    const user = await this.PrismaService.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: username,
          },
        ],
      },
    });
    if (!user || !Password.comparePassword(password, user.password)) {
      throw new BadRequestException('Invalid username or password');
    }
    const tokens = await this.jwtHelperService.generateAuthTokens(user.id);
    delete user.password;
    return {
      user,
      tokens,
    };
  }

  async register(registerInputDto: registerDto) {
    const { username, email, password, gender } = registerInputDto;

    const newUser = await this.userRepository.createUser({
      username,
      email,
      password,
      gender,
    });

    delete newUser.password;

    const activationToken = await this.jwtHelperService.generateAuthTokens(
      newUser.id,
    );
    await this.emailService.sendUserWelcome(
      {
        email: newUser.email,
        name: newUser.username,
      },
      activationToken.accessToken,
    );

    return newUser;
  }

  async activateAccount(token: string) {
    try {
      const { userId } = await this.jwtHelperService.verifyAccessToken({
        token,
        ignoreExpiration: false,
      });
      const existingUser = await this.PrismaService.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (existingUser.state === 'VERIFIED') {
        throw new BadRequestException('User already verified');
      }

      const user = await this.PrismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          state: 'VERIFIED',
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.PrismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const resetToken = await this.jwtHelperService.generateAuthTokens(user.id);

    await this.emailService.sendForgotPassword(
      {
        email: user.email,
        name: user.username,
      },
      resetToken.accessToken,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const { userId } = await this.jwtHelperService.verifyAccessToken({
        token,
        ignoreExpiration: false,
      });
      const user = await this.PrismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: await Password.hashPassword(newPassword, 10),
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async addOrg(data: addOrgDto) {
    const { username, email, password, gender } = data;

    const newUser = await this.userRepository.createUser({
      username,
      email,
      password,
      gender,
      role: ROLE_ENUM.ORGANIZATION,
    });

    const activationToken = await this.jwtHelperService.generateAuthTokens(
      newUser.id,
    );

    await this.emailService.sendUserWelcome(
      {
        email: newUser.email,
        name: newUser.username,
      },
      activationToken.accessToken,
    );

    delete newUser.password;

    return newUser;
  }
}
