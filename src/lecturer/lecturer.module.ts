import { Module } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';

@Module({
  providers: [LecturerService],
  controllers: [LecturerController],
})
export class LecturerModule {}
