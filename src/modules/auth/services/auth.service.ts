import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/services';
import type { AuthDto, LoginDto, RegisterDto } from '../dtos';
import { AuthService } from './auth.service.abstract';

@Injectable()
export class AuthServiceImpl extends AuthService {

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) { super(); }

  public async login(userDto: LoginDto): Promise<AuthDto> {
    const user = await this.userService.findOneUser(userDto.email);

    const passwordCheck = await bcrypt.compare(userDto.password, user.password);
    if (!passwordCheck) throw new UnauthorizedException('Incorrect password');

    return this.signToken(user.id, user.email);
  }

  public async register(userDto: RegisterDto): Promise<AuthDto> {
    const user = await this.userService.createOneUser(userDto);

    return this.signToken(user.id, user.email);
  }

  public async signToken(id: number, email: string): Promise<AuthDto> {
    const payload = { sub: id, email };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
    };

  }

}
