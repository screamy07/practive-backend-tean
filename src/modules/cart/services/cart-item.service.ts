import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FindOptionsRelations } from 'typeorm';
import { CartItemService } from './cart-item.service.abstract';
import { ProductService } from '../../products/services';
import type { User } from '../../users/entities';
import type { CreateCartItemDto } from '../dtos';
import type { CartItem } from '../entities';
import { ICartItemRepository } from '../interfaces';
import { CartItemRepository } from '../repositories';

@Injectable()
export class CartItemServiceImpl extends CartItemService {

  private _relationOptions: FindOptionsRelations<CartItem> = {
    product: true,
  };

  constructor(
    @Inject(CartItemRepository) private readonly cartItemRepository: ICartItemRepository,
    @Inject(ProductService) private readonly productService: ProductService,
  ) { super(); }

  public findAllCartItems(userId: number): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      relations: this._relationOptions,
      where: { user: { id: userId } },
    });
  }

  public async findOneCartItem(id: number, userId: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      relations: this._relationOptions,
      where: { id, user: { id: userId } },
    });
    if (!cartItem) throw new NotFoundException(`Cart item with ID ${id} not found`);

    return cartItem;
  }

  public async createOneCartItem(user: User, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const product = await this.productService.findOneProduct(createCartItemDto.productId);

    const createResult = await this.cartItemRepository.createOne(user, product);
    await this.cartItemRepository.increment({ id: createResult.id }, 'itemCount', createCartItemDto.itemCount);

    const cartItem = await this.findOneCartItem(createResult.id, user.id);

    return this.checkItemCount(cartItem);
  }

  public async deleteOneCartItem(id: number, userId: number): Promise<void> {
    const cartItem = await this.findOneCartItem(id, userId);

    await this.cartItemRepository.remove(cartItem);

  }

  public async checkItemCount(cartItem: CartItem): Promise<CartItem> {
    if (cartItem.itemCount <= 0) {
      const removedCartItem = await this.cartItemRepository.remove(cartItem);

      removedCartItem.itemCount = 0;

      return removedCartItem;
    }

    return cartItem;
  }

}
