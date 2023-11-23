import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma, ROLE_ENUM } from '@prisma/client';
import { AuthenticatedRequest } from 'src/shared/intefaces';

@Injectable({
  scope: Scope.REQUEST,
})
export class NgoService {
  constructor(
    private prismaService: PrismaService,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  async getNgos(filter?: Prisma.NGOWhereInput) {
    if (this.req.user.role === ROLE_ENUM.DISTRICTAUTHORITY) {
      const { district } = await this.prismaService.districtAuthority.findFirst(
        {
          where: {
            userId: this.req.user.id,
          },
        },
      );
      filter = {
        ...filter,
        district,
      };
    }
    return await this.prismaService.nGO.findMany({
      where: {
        ...filter,
      },
      include: {
        manager: true,
      },
    });
  }

  async getNgo(id: number) {
    return await this.prismaService.nGO.findUnique({
      where: {
        id,
      },
      include: {
        manager: true,
      },
    });
  }

  async createNgo(data: any) {
    return await this.prismaService.nGO.create({
      data,
    });
  }

  async updateNgo(id: number, data: any) {
    return await this.prismaService.nGO.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteNgo(id: number) {
    return await this.prismaService.nGO.delete({
      where: {
        id,
      },
    });
  }
}
