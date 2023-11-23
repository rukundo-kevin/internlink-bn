import { Module } from '@nestjs/common';
import { JwtHelperService } from './jwt-helper.service';

@Module({
  providers: [JwtHelperService],
  exports: [JwtHelperService],
})
export class JwtHelperModule {}
