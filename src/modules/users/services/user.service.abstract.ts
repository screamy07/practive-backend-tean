import type { RegisterDto } from '../../auth/dtos';
import type { UpdateUserDto } from '../dtos';
import type { User } from '../entities';

export abstract class UserService {

  public abstract findAllUsers(): Promise<User[]>;
  public abstract findOneUser(idOrEmail: number | string): Promise<User>;
  public abstract createOneUser(registerDto: RegisterDto): Promise<User>;
  public abstract updateOneUser(user: User, updateUserDto: UpdateUserDto): Promise<User>;
  public abstract deleteOneUser(user: User): Promise<void>;

}
