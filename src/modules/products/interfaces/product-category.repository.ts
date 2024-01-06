import type { Repository } from 'typeorm';
import type { Category } from '../../categories/entities';
import type { Product, ProductCategory } from '../entities';

interface CustomRepository {
  createOne(product: Product, category: Category): Promise<ProductCategory>;
}

type IProductCategoryRepository = CustomRepository & Repository<ProductCategory>;

export type { IProductCategoryRepository };
