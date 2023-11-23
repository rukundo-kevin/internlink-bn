import { SetMetadata } from '@nestjs/common';
import type { ROLE_ENUM } from '@prisma/client';

export const Roles = (...roles: ROLE_ENUM[]) => SetMetadata('roles', roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
