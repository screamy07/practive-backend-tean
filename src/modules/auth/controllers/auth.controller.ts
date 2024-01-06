import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthDto } from '../dtos';
import { LoginDto, RegisterDto } from '../dtos';
import { AuthService } from '../services';

@ApiTags('Authorization')
@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  public login(@Body() body: LoginDto): Promise<AuthDto> {
    return this.authService.login(body);
  }

  @Post('auth/register')
  public register(@Body() body: RegisterDto): Promise<AuthDto> {
    return this.authService.register(body);
  }

}
