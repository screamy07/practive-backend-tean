import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  public name!: string;

  @IsPositive()
  public price!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  public availableCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  public soldCount?: number = 0;

  @IsOptional()
  @IsString()
  public description?: string = '';

  @IsOptional()
  @IsString()
  public content?: string = '';

  @IsInt({ each: true })
  @Min(1, { each: true })
  public categoryIds!: number[];

}
