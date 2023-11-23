import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user/user.repository';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { Reflector } from '@nestjs/core';
import type { ROLE_ENUM } from '@prisma/client';
import { IS_PUBLIC_KEY } from './guard.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtHelperService: JwtHelperService,
    private userRepository: UserRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.jwtHelperService.getTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtHelperService.verifyAccessToken({ token });
      const user = await this.userRepository.getUserId(payload.userId);
      if (!user) {
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<ROLE_ENUM[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.matchRoles(roles, request.user.role);
  }

  private matchRoles(
    roles: ROLE_ENUM[],
    role: ROLE_ENUM,
  ): boolean | PromiseLike<boolean> {
    return roles.some((r) => r === role);
  }
}
