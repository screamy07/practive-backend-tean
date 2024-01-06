import type { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

declare type ApplyDecorators = <TFunction extends () => void, Y>(target: object | TFunction,
  propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;

declare type UploadFile = MulterField & { required?: boolean }
