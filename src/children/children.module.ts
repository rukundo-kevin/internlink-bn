import { Module } from '@nestjs/common';
import { CitizenService } from 'src/citizen/citizen.service';
import { childrenController } from './children.controller';
import { childrenService } from './children.service';

@Module({
  imports: [],
  controllers: [childrenController],
  providers: [childrenService],
})
export class childrenModule {}
