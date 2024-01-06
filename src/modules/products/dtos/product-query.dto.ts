import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ProductQuery {

  @IsOptional()
  @IsString()
  public name?: string = '';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public perPage?: number;

  @IsOptional()
  @Transform(({ value }) => value && (value as string).split(','))
  public categories?: number[];

}
