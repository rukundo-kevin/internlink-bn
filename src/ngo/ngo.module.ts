import { Module } from '@nestjs/common';
import { NgoController } from './ngo.controller';
import { NgoService } from './ngo.service';

@Module({
  controllers: [NgoController],
  providers: [NgoService],
})
export class NgoModule {}
