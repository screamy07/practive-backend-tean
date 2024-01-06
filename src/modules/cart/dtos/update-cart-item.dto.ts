import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from '.';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) { }
