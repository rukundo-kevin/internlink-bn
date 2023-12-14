import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class Organization {
  constructor(private prisma: PrismaService) {}
  async getOrganizations(filter: Prisma.OrganizationWhereInput) {
    const orgs = await this.prisma.organization.findMany({
      where: filter,
    });
    return orgs;
  }

  async createOrganization(data: Prisma.OrganizationCreateInput) {
    const org = await this.prisma.organization.create({
      data,
    });
    return org;
  }

  async updateOrganization(id: number, data: Prisma.OrganizationUpdateInput) {
    const org = await this.prisma.organization.update({
      where: { id },
      data,
    });
    return org;
  }

  async deleteOrganization(id: number) {
    const org = await this.prisma.organization.delete({
      where: { id },
    });
    return org;
  }
}
