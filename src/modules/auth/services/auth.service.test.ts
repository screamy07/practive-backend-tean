import { UnauthorizedException } from '@nestjs/common';
import type { Provider } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Role } from '../../../@framework/decorators';
import { AuthService, AuthServiceImpl } from '.';
import { User } from '../../users/entities';
import { UserService } from '../../users/services';
import type { LoginDto, RegisterDto } from '../dtos';

const CORRECT_ID = 1;
const JWT_EXPIRATION_TIME = '500m';
const JWT_SECRET_KEY = 'secret';
const ACCESS_TOKEN = 'token';

const users: User[] = User.fromMany([
  { id: 1, email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei' },
  { id: 2, email: 'matthew@gmail.com', password: 'cool', firstName: 'Matthew', secondName: 'Jones' }]);

function getUserById(id: number): User {
  return users.find(user => user.id === id) as User;
}

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let configService: ConfigService;
  let jwtService: JwtService;

  jest.mock('bcrypt', () => ({
    compare: (data: string | Buffer, encrypted: string): Promise<boolean> => Promise.resolve(data === encrypted),
  }));

  const authServiceImpl: Provider = {
    provide: AuthService,
    useClass: AuthServiceImpl,
  };

  const userServiceImpl: Provider = {
    provide: UserService,
    useValue: {
      findOneUser: jest.fn().mockResolvedValue(getUserById(CORRECT_ID)),
      createOneUser: jest.fn().mockResolvedValue(getUserById(CORRECT_ID)),
    },
  };

  const configServiceImpl: Provider = {
    provide: ConfigService,
    useValue: {
      get: jest.fn((key: string): string | undefined => {
        switch (key) {
          case 'JWT_EXPIRATION_TIME':
            return JWT_EXPIRATION_TIME;
          case 'JWT_SECRET_KEY':
            return JWT_SECRET_KEY;
        }

        return undefined;
      }),
    },
  };

  const jwtServiceImpl: Provider = {
    provide: JwtService,
    useValue: {
      signAsync: jest.fn().mockResolvedValue(ACCESS_TOKEN),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [authServiceImpl, userServiceImpl, configServiceImpl, jwtServiceImpl],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('logins user', async () => {
      const findOneUserSpy = jest.spyOn(userService, 'findOneUser');
      const getSpy = jest.spyOn(configService, 'get');
      const getSignAsync = jest.spyOn(jwtService, 'signAsync');
      const loginDto: LoginDto = { email: 'yuri@gmail.com', password: 'pass' };

      const result = await service.login(loginDto);

      expect(findOneUserSpy).toBeCalledWith(loginDto.email);
      expect(getSpy).toBeCalledTimes(2);
      expect(getSignAsync).toBeCalledTimes(1);
      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
    });

    it('password is not correct', () => {
      const loginDto: LoginDto = { email: 'yuri@gmail.com', password: 'wrongpass' };

      expect(async () => await service.login(loginDto))
        .rejects.toThrow(new UnauthorizedException('Incorrect password'));
    });
  });

  describe('register', () => {
    it('register new user', async () => {
      const createOneUserSpy = jest.spyOn(userService, 'findOneUser');
      const registerDto: RegisterDto = {
        email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei', role: Role.User,
      };

      const result = await service.register(registerDto);

      expect(createOneUserSpy).toBeCalledWith(registerDto);
      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
    });
  });

  describe('signToken', () => {
    it('returns jwt token', async () => {
      const { id, email } = getUserById(CORRECT_ID);

      const result = await service.signToken(id, email);

      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
    });
  });
});
