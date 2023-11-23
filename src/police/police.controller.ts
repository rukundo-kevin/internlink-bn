import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PoliceService } from './police.service';

@Controller('police')
export class PoliceController {
  constructor(private policeService: PoliceService) {}
  @Get()
  async getPolice() {
    return await this.policeService.getPolice();
  }
  @Delete(':id')
  async deletePolice(@Param('id', ParseIntPipe) id: number) {
    return await this.policeService.deletePolice(id);
  }
  @Put(':id')
  async updatePolice(@Param('id', ParseIntPipe) id: number, data: any) {
    return await this.policeService.updatePolice(id, data);
  }
}
