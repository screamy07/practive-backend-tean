import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { ApplyDecorators } from '../../@types/framework';

export const UseFile = (filename: string, type: string = 'multipart/form-data'): ApplyDecorators => applyDecorators(
  ApiConsumes(type),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [filename]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }),
  UseInterceptors(FileInterceptor(filename)));
