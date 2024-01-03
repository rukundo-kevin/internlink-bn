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

const createEducationSchema = z.object({
  school: z.string().nonempty(),
  degree: z.string().nonempty(),
  fieldofstudy: z.string().nonempty(),
  startDate: z
    .string()
    .optional()
    .transform((val) => new Date(val))
    .refine((val) => val < new Date(), {
      message: 'Start date must be in the past',
    }),
  endDate: z
    .string()
    .nonempty()
    .transform((val) => new Date(val)),
  grade: z.string().optional(),
});

const createExperienceSchema = z.object({
  title: z.string().nonempty(),
  company: z.string().nonempty(),
  startDate: z
    .string()
    .optional()
    .transform((val) => new Date(val))
    .refine((val) => val < new Date(), {
      message: 'Start date must be in the past',
    }),
  endDate: z
    .string()
    .nonempty()
    .transform((val) => new Date(val)),
  location: z.string().optional(),
  description: z.string().optional(),
});

const createCertificateSchema = z.object({
  title: z.string().nonempty(),
  organization: z.string().nonempty(),
  description: z.string().nonempty(),
});

export class createEducationDto extends createZodDto(createEducationSchema) {}
export class createExperienceDto extends createZodDto(createExperienceSchema) {}
export class createCertificateDto extends createZodDto(
  createCertificateSchema,
) {}
export class createInternshipDto extends createZodDto(createInternshipSchema) {}
