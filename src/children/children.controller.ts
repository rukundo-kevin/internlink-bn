import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { childrenService } from './children.service';

@Controller('children')
export class childrenController {
  constructor(private childrenService: childrenService) {}
  @Get('/')
  async getChildren() {
    const children = await this.childrenService.getChildren();
    return children;
  }

  @Patch('/:id/request-support')
  async requestSupport(@Param('id', ParseIntPipe) id: number) {
    const requestedSupport = await this.childrenService.requestSupport(id);
    return requestedSupport;
  }

  @Patch('/:id/approve-support')
  async approveSupportRequest(@Param('id', ParseIntPipe) id: number) {
    const requestedSupport = await this.childrenService.updateChild(id, {
      status: 'SUPPORT_APPROVED',
    });
    return requestedSupport;
  }

  @Patch('/:id/reject-support')
  async rejectSupportRequest(@Param('id', ParseIntPipe) id: number) {
    const requestedSupport = await this.childrenService.updateChild(id, {
      status: 'SUPPORT_REJECTED',
    });
    return requestedSupport;
  }

  @Patch('/:id/request-adoption')
  async requestAdoption(@Param('id', ParseIntPipe) id: number) {
    const adoption = await this.childrenService.requestAdoption(id);
    return adoption;
  }

  @Patch('/:id/approve-adoption')
  async approveAdoption(@Param('id', ParseIntPipe) id: number) {
    const adoption = await this.childrenService.approveAdoption(id);
    return adoption;
  }

  @Patch('/:id/reject-adoption')
  async rejectAdoption(@Param('id', ParseIntPipe) id: number) {
    const adoption = await this.childrenService.rejectAdoption(id);
    return adoption;
  }
}
