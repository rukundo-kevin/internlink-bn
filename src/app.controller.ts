import { Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './guard/guard.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  @Post('/')
  @Public()
  index(): string {
    return 'Welcome to Save InternLink!';
  }
}
