import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { Organization } from './organization.service';

@Module({
  controllers: [OrganizationController],
  providers: [Organization],
})
export class OrganizationModule {}
