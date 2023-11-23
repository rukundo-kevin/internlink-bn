import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@app/libs/src/shared.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard, RolesGuard } from './guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@app/libs/src/prisma/prisma.module';
import { JwtHelperModule } from './jwt-helper/jwt-helper.module';
import { repositoryModule } from './repositories/repository.module';
import { AdminModule } from './admin/admin.module';
import { citizenModule } from './citizen/citizen.module';
import { MulterModule } from '@nestjs/platform-express';
import { childrenModule } from './children/children.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { OrphanageController } from './orphanage/orphanage.controller';
import { NgoModule } from './ngo/ngo.module';
import { PoliceModule } from './police/police.module';
import { DistrictModule } from './district/district.module';
import { OrphanageModule } from './orphanage/orphanage.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    SharedModule.registerZodValidationPipe(),
    AuthModule,
    PrismaModule,
    JwtHelperModule,
    AdminModule,
    repositoryModule,
    childrenModule,
    citizenModule,
    CloudinaryModule,
    EmailModule,
    OrphanageModule,
    NgoModule,
    PoliceModule,
    DistrictModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
