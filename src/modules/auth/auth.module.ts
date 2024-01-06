import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { AuthController } from './controllers';
import { AuthService, AuthServiceImpl } from './services';
import { JwtStrategy } from './strategy';

const authService: Provider = { provide: AuthService, useClass: AuthServiceImpl };

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [authService, JwtStrategy],
})
export class AuthModule { }
