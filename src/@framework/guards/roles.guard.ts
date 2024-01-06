import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../decorators';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: Express.Request = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException('User not authorized');

    return requiredRoles.some((requiredRole) => (user as any)?.role?.includes(requiredRole));
  }

}
