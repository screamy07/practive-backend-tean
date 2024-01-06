import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from '.';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

}
