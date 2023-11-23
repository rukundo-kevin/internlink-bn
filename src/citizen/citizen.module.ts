import { Module } from '@nestjs/common';
import { citizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [citizenController],
  providers: [CitizenService],
})
export class citizenModule {}
