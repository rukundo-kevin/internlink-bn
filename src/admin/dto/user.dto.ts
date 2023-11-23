import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createUserSchema = z.object({
  email: z.string().email().nonempty(),
  gender: z.string().nonempty(),
  role: z.string().nonempty(),
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  telephone: z.string().nonempty(),
  province: z.string().optional(),
  district: z.string().nonempty(),
  sector: z.string().optional(),
});

export class createUserDto extends createZodDto(createUserSchema) {}
