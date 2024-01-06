import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
export class UpdateUserDto {

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  public email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @Transform(({ value }) => (value as string).trim())
  public password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => (value as string).trim())
  public firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => (value as string).trim())
  public secondName?: string;

}
