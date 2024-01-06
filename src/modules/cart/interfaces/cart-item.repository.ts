import type { Repository } from 'typeorm';
import type { Product } from '../../products/entities';
import type { User } from '../../users/entities';
import type { CartItem } from '../entities';

interface CustomRepository {
  createOne(user: User, product: Product): Promise<CartItem>;
}

type ICartItemRepository = CustomRepository & Repository<CartItem>;

export type { ICartItemRepository };
