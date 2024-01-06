import {
  Body, Controller, Delete, Get, HttpCode,
  HttpStatus, Param, ParseIntPipe, Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role, UserDecorator, UseSecurity } from '../../../@framework/decorators';
import { User } from '../../users/entities';
import { CartItemDto, CreateCartItemDto } from '../dtos';
import { CartItemService } from '../services';

@ApiTags('User cart')
@Controller('user/cart')
export class CartItemController {

  constructor(private readonly cartItemService: CartItemService) { }

  @UseSecurity(Role.User, Role.Admin)
  @Get()
  public async findAllCartItems(@UserDecorator() user: User): Promise<CartItemDto[]> {
    return CartItemDto.fromEntities(await this.cartItemService.findAllCartItems(user.id));
  }

  @UseSecurity(Role.User, Role.Admin)
  @Get(':id')
  public async findOneCartItem(@UserDecorator() user: User, @Param('id', ParseIntPipe) id: number)
    : Promise<CartItemDto> {
    return CartItemDto.fromEntity(await this.cartItemService.findOneCartItem(id, user.id));
  }

  @UseSecurity(Role.User, Role.Admin)
  @Post()
  public async createOneCartItem(
    @UserDecorator() user: User,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItemDto> {
    return CartItemDto.fromEntity(await this.cartItemService.createOneCartItem(user, createCartItemDto));
  }

  @UseSecurity(Role.User, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public deleteOneCartItem(@UserDecorator() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cartItemService.deleteOneCartItem(id, user.id);
  }

}
