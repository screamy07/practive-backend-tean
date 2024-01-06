import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  public name!: string;

}
