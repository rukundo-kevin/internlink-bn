import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DistrictService {
  constructor(private prismaService: PrismaService) {}
  async getDistricts(filter?: any) {
    return await this.prismaService.districtAuthority.findMany({
      where: {
        ...filter,
      },
    });
  }
  async updateDistrict(id: number, data: any) {
    return await this.prismaService.districtAuthority.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteDistrict(id: number) {
    return await this.prismaService.districtAuthority.delete({
      where: {
        id,
      },
    });
  }
}
