import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const reportChildrenSchema = z.object({
  gender: z.string().nonempty(),
  name: z.string().nonempty(),
  province: z.string().nonempty(),
  ageRange: z.string().nonempty(),
  description: z.string().nonempty(),
  district: z.string().nonempty(),
  sector: z.string().nonempty(),
  photo: z.string().nonempty(),
});

export class reportChildrenDto extends createZodDto(reportChildrenSchema) {}
