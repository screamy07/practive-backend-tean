import { OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { CreateProductDto } from '.';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['name', 'price'])) {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  public name?: string;

  @IsOptional()
  @IsPositive()
  public price?: number;

}
