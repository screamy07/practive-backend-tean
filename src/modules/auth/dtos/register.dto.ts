import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from '../../../@framework/decorators';
import { LoginDto } from '.';
import { Transform } from 'class-transformer';

export class RegisterDto extends LoginDto {

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => (value as string).trim())
  public firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => (value as string).trim())
  public secondName!: string;

  @IsEnum(Role)
  public role!: Role;

}
