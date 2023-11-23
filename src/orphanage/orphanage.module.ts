import { Module } from '@nestjs/common';
import { OrphanageService } from './orphanage.service';
import { OrphanageController } from './orphanage.controller';

@Module({
  imports: [],
  controllers: [OrphanageController],
  providers: [OrphanageService],
})
export class OrphanageModule {}
