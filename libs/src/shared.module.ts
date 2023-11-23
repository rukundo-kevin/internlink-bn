import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { EnvConfig, envConfigDtoSchema } from './dto/env.config.dto';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
@Module({
  imports: [
    TypedConfigModule.forRoot({
      isGlobal: true,
      load: dotenvLoader(),
      schema: EnvConfig,
      validate: (config) => envConfigDtoSchema.parse(config),
    }),
  ],
  providers: [],
  exports: [],
})
export class SharedModule {
  static registerZodValidationPipe(): DynamicModule {
    const providers = [
      {
        provide: APP_PIPE,
        useClass: ZodValidationPipe,
      },
    ];
    return {
      module: SharedModule,
      providers,
    };
  }
}
