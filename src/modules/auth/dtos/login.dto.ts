import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class LoginDto {

  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @Transform(({ value }) => (value as string).trim())
  public password!: string;

}
