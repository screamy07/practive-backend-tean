import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { RegisterDto } from '../../auth/dtos';
import type { UpdateUserDto } from '../dtos';
import type { User } from '../entities';
import { IUserRepository } from '../interfaces';
import { UserRepository } from '../repositories';
import { UserService } from './user.service.abstract';

@Injectable()
export class UserServiceImpl extends UserService {

  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  public findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOneUser(idOrEmail: number | string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail },
    });
    if (!user) throw new NotFoundException(`User with ${idOrEmail} not found`);

    return user;
  }

  public async createOneUser(registerDto: RegisterDto): Promise<User> {
    const hashSalt = await bcrypt.genSalt();

    return this.userRepository
      .createOne({ ...registerDto, password: await bcrypt.hash(registerDto.password, hashSalt) });
  }

  public updateOneUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateOne(user, updateUserDto);
  }

  public async deleteOneUser(user: User): Promise<void> {
    await this.userRepository.remove(user);
  }

}
