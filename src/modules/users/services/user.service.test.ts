import type { Provider } from '@nestjs/common/interfaces';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { RegisterDto } from '../../../modules/auth/dtos';
import { UserService } from '.';
import { User } from '../entities';
import type { IUserRepository } from '../interfaces';
import { UserRepository } from '../repositories';
import { UserServiceImpl } from './user.service';
import { Role } from '../../../@framework/decorators';
import type { UpdateUserDto } from '../dtos';

const CORRECT_ID = 1;
const BCRYPT_SALT = 'salt';

const users: User[] = User.fromMany([
  { id: 1, email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei' },
  { id: 2, email: 'matthew@gmail.com', password: 'cool', firstName: 'Matthew', secondName: 'Jones' }]);

function getUserById(id: number): User {
  return users.find(user => user.id === id) as User;
}

const mockUserRepositoryFactory: () => MockType<IUserRepository> =
  jest.fn(() => ({
    find: jest.fn().mockResolvedValue(users),
    findOne: jest.fn().mockResolvedValue(getUserById(1)),
    createOne: jest.fn().mockResolvedValue(getUserById(1)),
    updateOne: jest.fn().mockResolvedValue(getUserById(1)),
    remove: jest.fn(),
  }));

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;

  jest.mock('bcrypt', () => ({
    genSalt: jest.fn().mockResolvedValue(BCRYPT_SALT),
    hash: jest.fn().mockResolvedValue(getUserById(1).password),
  }));

  const userService: Provider = {
    provide: UserService,
    useClass: UserServiceImpl,
  };

  const userRepository: Provider = {
    provide: UserRepository,
    useFactory: mockUserRepositoryFactory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [userService, userRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<IUserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('returns all users', async () => {
      const result = await service.findAllUsers();

      expect(result).toStrictEqual(users);
    });
  });

  describe('findOneUser', () => {
    it('returs one user', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOne');

      const result = await service.findOneUser(CORRECT_ID);

      expect(findOneSpy).toBeCalledWith({
        where: { id: CORRECT_ID },
      });
      expect(result).toStrictEqual(getUserById(CORRECT_ID));
    });
  });

  describe('createOneUser', () => {
    it('creates one user', async () => {
      const registerDto: RegisterDto = {
        email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei', role: Role.User,
      };

      const result = await service.createOneUser(registerDto);

      expect(result).toStrictEqual(getUserById(CORRECT_ID));
    });
  });

  describe('updateOneUser', () => {
    it('updates user', async () => {
      const updateUserDto: UpdateUserDto = {};

      const result = await service.updateOneUser(getUserById(CORRECT_ID), updateUserDto);

      expect(result).toStrictEqual(getUserById(CORRECT_ID));
    });
  });

  describe('deleteOneUser', () => {
    it('deletes user', async () => {
      const result = await service.deleteOneUser(getUserById(CORRECT_ID));

      expect(result).toBeUndefined();
    });
  });
});
