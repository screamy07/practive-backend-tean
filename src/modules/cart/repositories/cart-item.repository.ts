import type { DataSource } from 'typeorm';
import type { Product } from '../../products/entities';
import type { User } from '../../users/entities';
import { CartItem } from '../entities';
import type { ICartItemRepository } from '../interfaces';

export const CartItemRepository = Symbol('CART_ITEM_REPOSITORY');

export const CartItemRepositoryFactory =
  (dataSource: DataSource): ICartItemRepository => dataSource.getRepository(CartItem).extend({

    async createOne(user: User, product: Product): Promise<CartItem> {
      const cartItem = await this.findOne({ where: { user: { id: user.id }, product: { id: product.id } } });

      if (!cartItem) {
        const newCartItem = this.create({ user, product });
        return this.save(newCartItem);
      }

      return cartItem;
    },

  });
