import { UseGuards } from '@nestjs/common';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { ApplyDecorators } from '../../@types/framework';
import { JwtGuard, RolesGuard } from '../guards';

export enum Role {
  User = 'user',
  Admin = 'admin'
}

export const ROLES_KEY = Symbol('ROLES');

export const UseSecurity = (...roles: Role[]): ApplyDecorators => applyDecorators(
  SetMetadata(ROLES_KEY, roles),
  UseGuards(JwtGuard, RolesGuard),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized' }),
);
