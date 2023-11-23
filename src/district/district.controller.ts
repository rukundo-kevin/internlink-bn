import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private districtService: DistrictService) {}
  @Get()
  async getDistricts() {
    return await this.districtService.getDistricts();
  }

  @Delete(':id')
  async deleteDistrict(@Param('id', ParseIntPipe) id: number) {
    return await this.districtService.deleteDistrict(id);
  }

  @Get(':id')
  async getDistrict(@Param('id', ParseIntPipe) id: number) {
    return await this.districtService.getDistricts({ id });
  }

  @Put(':id')
  async updateDistrict(@Param('id', ParseIntPipe) id: number, data: any) {
    return await this.districtService.updateDistrict(id, data);
  }
}
