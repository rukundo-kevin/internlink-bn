import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const envConfigDtoSchema = z.object({
  PORT: z.number().default(7000),
  DATABASE_URL: z.string().default(''),
  FRONTEND_URL: z.string().default(''),
  NODE_ENV: z
    .union([z.literal('development'), z.literal('production')])
    .default('development'),
  JWT_SECRET: z.string().default(''),
  JWT_EXPIRATION_TIME: z.string().default(''),
  ACCESS_TOKEN_SECRET: z.string().default(''),
  ACCESS_TOKEN_EXPIRY: z.string().default(''),
  REFRESH_TOKEN_SECRET: z.string().default(''),
  REFRESH_TOKEN_EXPIRY: z.string().default(''),
  BACKEND_URL: z.string().default(''),
});

export class EnvConfig extends createZodDto(envConfigDtoSchema) {}
