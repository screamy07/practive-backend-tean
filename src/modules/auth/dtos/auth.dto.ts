import { IsJWT } from 'class-validator';

export class AuthDto {

  @IsJWT()
  public access_token!: string;

}
