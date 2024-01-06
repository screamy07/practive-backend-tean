import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

export const UserDecorator = createParamDecorator(
  (data: keyof Express.User, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException('User not authorized');

    return data ? user[data] : user;
  },
);
