import type { DataSource } from 'typeorm';
import type { Category } from '../../categories/entities';
import type { Product } from '../entities';
import { ProductCategory } from '../entities';
import type { IProductCategoryRepository } from '../interfaces';

export const ProductCategoryRepository = Symbol('PRODUCT_CATEGORY_REPOSITORY');

export const ProductCategoryRepositoryFactory =
  (dataSource: DataSource): IProductCategoryRepository =>
    dataSource.getRepository(ProductCategory).extend({
      async createOne(product: Product, category: Category): Promise<ProductCategory> {
        const productCategory = this.create({ product, category });

        return this.save(productCategory);
      },
    });

