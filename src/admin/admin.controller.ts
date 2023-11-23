import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Post,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/guard/guard.decorator';
import { ROLE_ENUM } from '@prisma/client';
import { createUserDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';

@Controller('users')
@Roles(ROLE_ENUM.ADMIN)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private emailService: EmailService,
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
    data: any,
  ) {
    const user = await this.adminService.updateUser(userId, data);
    return user;
  }

}
