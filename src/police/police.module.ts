import { Module } from '@nestjs/common';
import { PoliceService } from './police.service';
import { PoliceController } from './police.controller';

@Module({
  providers: [PoliceService],
  controllers: [PoliceController]
})
export class PoliceModule {}
