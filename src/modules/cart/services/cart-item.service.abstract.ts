import type { CreateCartItemDto } from '../dtos';
import type { User } from '../../users/entities';
import type { CartItem } from '../entities';

export abstract class CartItemService {

  public abstract findAllCartItems(userId: number): Promise<CartItem[]>;
  public abstract findOneCartItem(id: number, userId: number): Promise<CartItem>;
  public abstract createOneCartItem(user: User, createCartItemDto: CreateCartItemDto): Promise<CartItem>;
  public abstract deleteOneCartItem(id: number, userId: number): Promise<void>;
  public abstract checkItemCount(cartItem: CartItem): Promise<CartItem>;

}
