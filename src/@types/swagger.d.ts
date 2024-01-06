import type { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

declare type ApiBodyProperty = Record<string, SchemaObject | ReferenceObject>
