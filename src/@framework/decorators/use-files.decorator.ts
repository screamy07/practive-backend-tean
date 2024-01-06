import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { UploadFile, ApplyDecorators } from '../../@types/framework';
import type { ApiBodyProperty } from '../../@types/swagger';

export const UseFiles = (
  files: UploadFile[],
  multipleFileNames?: string[],
  type: string = 'multipart/form-data',
): ApplyDecorators => {

  const apiBodyProperties: ApiBodyProperty = Object.assign({},
    ...files.map<ApiBodyProperty>(({ name }) => {
      if (multipleFileNames && multipleFileNames.includes(name)) {
        return { [name]: { type: 'array', items: { type: 'string', format: 'binary' } } };
      }

      return { [name]: { type: 'string', format: 'binary' } };
    })) as ApiBodyProperty;

  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: apiBodyProperties,
      required: files.filter((f) => f.required).map((f) => f.name),
    },
  });

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(files)),
    ApiConsumes(type),
    apiBody,
  );
};
