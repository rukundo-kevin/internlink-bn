import { ROLE_ENUM } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string(),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional(),
  password: z.string().refine(
    (password) => {
      const capitalLetterRegex = /[A-Z]/;
      const numberRegex = /[0-9]/;
      const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

      return (
        capitalLetterRegex.test(password) &&
        numberRegex.test(password) &&
        specialCharacterRegex.test(password)
      );
    },
    {
      message:
        'Password must include at least one capital letter, one number, and one special character',
    },
  ),
});

const addOrgSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().refine(
    (password) => {
      const capitalLetterRegex = /[A-Z]/;
      const numberRegex = /[0-9]/;
      const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

      return (
        capitalLetterRegex.test(password) &&
        numberRegex.test(password) &&
        specialCharacterRegex.test(password)
      );
    },
    {
      message:
        'Password must include at least one capital letter, one number, and one special character',
    },
  ),
  orgName: z.string().min(3).max(20),
  telephone: z.string(),
  province: z.string(),
  district: z.string(),
  sector: z.string(),
  address: z.string(),
  gender: z.string().optional(),
});

export class loginDto extends createZodDto(loginSchema) {}
export class registerDto extends createZodDto(registerSchema) {}
export class addOrgDto extends createZodDto(addOrgSchema) {}
