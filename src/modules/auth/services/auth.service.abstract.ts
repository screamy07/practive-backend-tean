import type { LoginDto, RegisterDto, AuthDto } from '../dtos';

export abstract class AuthService {

  public abstract login(userDto: LoginDto): Promise<AuthDto>;
  public abstract register(userDto: RegisterDto): Promise<AuthDto>;
  public abstract signToken(id: number, email: string): Promise<AuthDto>;

}
