import type { Repository } from 'typeorm';
import type { RegisterDto } from '../../../modules/auth/dtos';
import type { UpdateUserDto } from '../dtos';
import type { User } from '../entities';

interface CustomRepository {
  createOne(registerDto: RegisterDto): Promise<User>;
  updateOne(user: User, updateUserDto: UpdateUserDto): Promise<User>;
}

type IUserRepository = CustomRepository & Repository<User>;

export type { IUserRepository };
