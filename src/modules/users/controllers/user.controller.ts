import {
  Body, Controller, Delete, Get,
  HttpCode,
  HttpStatus, Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role, UseSecurity, UserDecorator } from '../../../@framework/decorators';
import { UpdateUserDto, UserDto } from '../dtos';
import { User } from '../entities';
import { UserService } from '../services';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @UseSecurity(Role.User, Role.Admin)
  @Get('profile')
  public async findOne(@UserDecorator() user: User): Promise<UserDto> {
    return UserDto.fromEntity(await this.userService.findOneUser(user.id));
  }

  @UseSecurity(Role.Admin)
  @Get('profiles')
  public async findAll(): Promise<UserDto[]> {
    return UserDto.fromEntities(await this.userService.findAllUsers());
  }

  @UseSecurity(Role.User, Role.Admin)
  @Patch('profile')
  public async update(@UserDecorator() user: User, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return UserDto.fromEntity(await this.userService.updateOneUser(user, updateUserDto));
  }

  @UseSecurity(Role.User, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile')
  public remove(@UserDecorator() user: User): Promise<void> {
    return this.userService.deleteOneUser(user);
  }

}
