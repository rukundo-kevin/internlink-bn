import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { AuthenticatedRequest } from '../shared/intefaces';
import { CHILD_STATUS } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class CitizenService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: AuthenticatedRequest,
  ) {}

  async reportChildren(data: any) {
    try {
      const newChildren = await this.prisma.streetChild.create({
        data: {
          ...data,
          status: CHILD_STATUS.REPORTED,
          reporter: {
            connect: {
              id: this.request.user.id,
            },
          },
        },
      });

      return newChildren;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
