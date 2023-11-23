import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrphanageService } from './orphanage.service';
import { User } from 'src/guard/user.decorator';

@Controller('orphanage')
export class OrphanageController {
  constructor(private orphanageService: OrphanageService) {}
  @Get()
  async getOrphanages() {
    return await this.orphanageService.getOrphanages();
  }
  @Get('/adoption-requests')
  async getAdoptionRequests() {
    return await this.orphanageService.getAdoptionRequests();
  }
  @Get(':id')
  async getOrphanage(@Param('id', ParseIntPipe) id: number) {
    return await this.orphanageService.getOrphanages({ id });
  }
  @Delete(':id')
  async deleteOrphanage(@Param('id', ParseIntPipe) id: number) {
    return await this.orphanageService.deleteOrphanage(id);
  }
}
