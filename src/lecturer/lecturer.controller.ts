import { Controller, Get, Post } from '@nestjs/common';
import { LecturerService } from './lecturer.service';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}
  @Post()
  async createLecturer() {
    return this.lecturerService.createLecturer();
  }

  @Get()
  async getLecturer() {
    return this.lecturerService.getLecturer();
  }
}
