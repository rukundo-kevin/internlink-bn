import { Controller, Get } from '@nestjs/common';
import { Organization } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: Organization) {}
  @Get('/')
  async getOrganizations() {
    const organizations = await this.organizationService.getOrganizations({});
    return organizations;
  }
}
