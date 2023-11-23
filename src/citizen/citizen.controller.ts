import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Roles } from 'src/guard/guard.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('citizen')
@Roles('CITIZEN')
export class citizenController {
  constructor(
    private citizenService: CitizenService,
    private cloudinary: CloudinaryService,
  ) {}
  @Post('/report-children')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
    }),
  )
  async reportChildren(
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // if (!image) throw new BadRequestException('Image is required');

    // const photo = await this.cloudinary.uploadImage(image).catch((err) => {
    //   throw new BadRequestException('Invalid file type.');
    // });

    const newChildren = await this.citizenService.reportChildren({
      ...data,
      photo: 'photo?.url',
    });

    return newChildren;
  }
}
