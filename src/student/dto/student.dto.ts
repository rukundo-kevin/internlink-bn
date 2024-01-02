import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createInternshipSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  duration: z.string().nonempty(),
  deadline: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => val > new Date(), {
      message: 'Deadline must be in the future',
    }),
  unit: z.string().nonempty(),
  startDate: z
    .string()
    .optional()
    .transform((val) => new Date(val))
    .refine((val) => val > new Date(), {
      message: 'Start date must be in the future',
    }),
  department: z.string().nonempty(),
});

export class createInternshipDto extends createZodDto(createInternshipSchema) {}
