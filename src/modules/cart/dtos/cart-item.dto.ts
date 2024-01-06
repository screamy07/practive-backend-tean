import { ProductDto } from '../../products/dtos';
import type { CartItem } from '../entities';

export class CartItemDto {

  public id!: number;
  public itemCount!: number;
  public product!: ProductDto;

  public static fromEntity(cartItem: CartItem): CartItemDto {
    const cartItemDto = new CartItemDto();
    cartItemDto.id = cartItem.id;
    cartItemDto.itemCount = cartItem.itemCount;
    cartItemDto.product = ProductDto.fromEntity(cartItem.product);

    return cartItemDto;
  }

  public static fromEntities(cartItems: CartItem[]): CartItemDto[] {
    const cartItemDtos: CartItemDto[] = [];

    cartItems.forEach(cartItem => cartItemDtos.push(this.fromEntity(cartItem)));
    return cartItemDtos;
  }

}
