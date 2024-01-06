import { IsEmail, IsInt, IsPositive, MaxLength } from 'class-validator';

export class PayloadDto {

  @IsPositive()
  @IsInt()
  public sub!: number;

  @IsEmail()
  @MaxLength(50)
  public email!: string;

}
