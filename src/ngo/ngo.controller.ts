import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { NgoService } from './ngo.service';

@Controller('ngo')
export class NgoController {
  constructor(private ngoService: NgoService) {}

  @Get()
  async getNgos() {
    return await this.ngoService.getNgos();
  }

  @Delete(':id')
  async deleteNgo(@Param('id', ParseIntPipe) id: number) {
    return await this.ngoService.deleteNgo(id);
  }

  @Put(':id')
  async updateNgo(@Param('id', ParseIntPipe) id: number, data: any) {
    return await this.ngoService.updateNgo(id, data);
  }
}
