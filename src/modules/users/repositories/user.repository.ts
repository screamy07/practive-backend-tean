import * as bcrypt from 'bcrypt';
import type { DataSource } from 'typeorm';
import type { RegisterDto } from '../../auth/dtos';
import type { UpdateUserDto } from '../dtos';
import { User } from '../entities';
import type { IUserRepository } from '../interfaces';

export const UserRepository = Symbol('USER_REPOSITORY');

export const UserRepositoryFactory = (dataSource: DataSource): IUserRepository =>
  dataSource.getRepository(User).extend({
    createOne(registerDto: RegisterDto): Promise<User> {
      const user = this.create(registerDto);

      return this.save(user);
    },

    async updateOne(user: User, updateUserDto: UpdateUserDto): Promise<User> {
      const mergedUser = this.merge(user, updateUserDto);

      if (updateUserDto.password) {
        const hashSalt = await bcrypt.genSalt();

        mergedUser.password = await bcrypt.hash(updateUserDto.password, hashSalt);
      }

      return this.save(mergedUser);
    },
  });
