import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserRepository, UserRepositoryFactory } from './repositories';
import { UserService, UserServiceImpl } from './services';

const userService: Provider = { provide: UserService, useClass: UserServiceImpl };

const userRepository: Provider = {
  provide: UserRepository,
  useFactory: UserRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [],
  exports: [userService],
  controllers: [UserController],
  providers: [userService, userRepository],
})
export class UserModule { }
