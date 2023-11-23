import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliceService {
  constructor(private prismaService: PrismaService) {}

  async getPolice(filter?: any) {
    return await this.prismaService.police.findMany({
      where: {
        ...filter,
      },
    });
  }

  async updatePolice(id: number, data: any) {
    return await this.prismaService.police.update({
      where: {
        id,
      },
      data,
    });
  }

  async deletePolice(id: number) {
    return await this.prismaService.police.delete({
      where: {
        id,
      },
    });
  }
}
