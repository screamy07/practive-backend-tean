import type { User } from '../entities';

export class UserDto {

  public id!: number;
  public email!: string;
  public isVerified!: boolean;
  public firstName!: string;
  public secondName!: string;

  public static fromEntity(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.email = user.email;
    userDto.isVerified = user.isVerified;
    userDto.firstName = user.firstName;
    userDto.secondName = user.secondName;

    return userDto;
  }

  public static fromEntities(users: User[]): UserDto[] {
    const userDtos: UserDto[] = [];

    users.forEach(user => userDtos.push(this.fromEntity(user)));
    return userDtos;
  }

}
