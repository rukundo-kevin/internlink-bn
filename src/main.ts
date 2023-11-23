import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '@app/libs/src/prisma/prisma.service';
import { GlobalExceptionFilterFilter } from '@app/libs/src/global-exception-filter/global-exception-filter.filter';
import { EnvConfig } from '@app/libs/src/dto/env.config.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envConfig = app.get(EnvConfig);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.enableCors({
    allowedHeaders: [
      'Content-Type',
      'Content-Security-Policy',
      'Permissions-Policy',
      'Authorization',
      'Origin',
      'Accept',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: [
      envConfig.FRONTEND_URL,
      envConfig.BACKEND_URL,
      'http://localhost:3000',
      'localhost:3000',
      'http://localhost:4173',
      'localhost:4173',
      'http://localhost:8086',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilterFilter(httpAdapter));

  await app.listen(envConfig.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
