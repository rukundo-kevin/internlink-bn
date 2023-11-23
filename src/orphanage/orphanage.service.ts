import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Scope, Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Orphanage, Prisma, ROLE_ENUM } from '@prisma/client';
import { AuthenticatedRequest } from 'src/shared/intefaces';

@Injectable({
  scope: Scope.REQUEST,
})
export class OrphanageService {
  constructor(
    private prismaService: PrismaService,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  async getOrphanages(filter?: Prisma.OrphanageWhereUniqueInput) {
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
    return await this.prismaService.orphanage.findMany({
      where: {
        ...filter,
      },
      include: {
        manager: true,
        children: true,
      },
    });
  }

  async updateOrphanage(
    id: number,
    data: Prisma.OrphanageUpdateInput,
  ): Promise<Orphanage> {
    return await this.prismaService.orphanage.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteOrphanage(id: number): Promise<Orphanage> {
    return await this.prismaService.orphanage.delete({
      where: {
        id,
      },
    });
  }

  async getAdoptionRequests() {
    return await this.prismaService.adoption_Request.findMany({
      where: {
        child: {
          orphanage: {
            manager: {
              id: this.req.user.id,
            },
          },
        },
      },
      include: {
        child: true,
        user: true,
      },
    });
  }
}
