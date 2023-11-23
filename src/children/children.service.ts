import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/shared/intefaces';
import { Prisma } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class childrenService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: AuthenticatedRequest,
  ) {}

  async getChildren(filter?: any) {
    const children = await this.prisma.streetChild.findMany({
      where: {
        ...filter,
      },
      include: {
        adoptionRequests: {
          include: {
            user: true,
          },
        },
        orphanage: {
          include: {
            manager: true,
          },
        },
      },
    });

    return children;
  }

  async getChild(childId: number) {
    const child = await this.prisma.streetChild.findUnique({
      where: {
        id: childId,
      },
    });

    return child;
  }

  async updateChild(childId: number, data: Prisma.StreetChildUpdateInput) {
    const child = await this.prisma.streetChild.update({
      where: {
        id: childId,
      },
      data: {
        ...data,
      },
    });

    return child;
  }

  async deleteChild(childId: number) {
    const child = await this.prisma.streetChild.delete({
      where: {
        id: childId,
      },
    });

    return child;
  }

  async requestSupport(childId: number) {
    try {
      const { id } = await this.prisma.orphanage.findFirst({
        where: {
          manager: {
            id: this.request.user.id,
          },
        },
      });

      const child = await this.prisma.streetChild.update({
        where: {
          id: childId,
        },
        data: {
          orphanage: {
            connect: {
              id,
            },
          },
          status: 'SUPPORT_REQUESTED',
        },
      });

      return child;
    } catch (error) {
      throw new BadRequestException('Problem requesting support for the child');
    }
  }

  async requestAdoption(childId: number) {
    const adoptionExists = await this.prisma.adoption_Request.findFirst({
      where: {
        childId,
        user: {
          id: this.request.user.id,
        },
      },
    });
    if (adoptionExists) {
      throw new BadRequestException(
        'You have already requested adoption for this child',
      );
    }

    const adoption = await this.prisma.adoption_Request.create({
      data: {
        child: {
          connect: {
            id: childId,
          },
        },
        user: {
          connect: {
            id: this.request.user.id,
          },
        },
        status: 'pending',
      },
    });
    await this.prisma.streetChild.update({
      where: {
        id: childId,
      },
      data: {
        status: 'ADOPTION_REQUESTED',
      },
    });
    return adoption;
  }

  async approveAdoption(id: number) {
    const adoptionExists = await this.prisma.adoption_Request.findFirst({
      where: {
        id,
      },
    });

    if (!adoptionExists || adoptionExists.status !== 'pending') {
      throw new BadRequestException(
        'Adoption request has already been handled',
      );
    }

    const adoption = await this.prisma.adoption_Request.update({
      where: {
        id,
      },
      data: {
        status: 'approved',
      },
    });

    await this.prisma.streetChild.update({
      where: {
        id: adoptionExists.childId,
      },
      data: {
        status: 'ADOPTION_APPROVED',
        orphanage: {
          disconnect: true,
        },
      },
    });

    return adoption;
  }

  async rejectAdoption(id: number) {
    const adoptionExists = await this.prisma.adoption_Request.findFirst({
      where: {
        id,
      },
    });

    if (!adoptionExists || adoptionExists.status !== 'pending') {
      throw new BadRequestException(
        'Adoption request has already been handled',
      );
    }

    const adoption = await this.prisma.adoption_Request.update({
      where: {
        id,
      },
      data: {
        status: 'rejected',
      },
    });

    await this.prisma.streetChild.update({
      where: {
        id: adoptionExists.childId,
      },
      data: {
        status: 'ADOPTION_REJECTED',
      },
    });

    return adoption;
  }
}
