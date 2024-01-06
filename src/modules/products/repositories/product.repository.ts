import type { DataSource } from 'typeorm';
import type { CreateProductDto, UpdateProductDto } from '../dtos';
import { Product } from '../entities';
import type { IProductRepository } from '../interfaces';

export const ProductRepository = Symbol('PRODUCT_REPOSITORY');

export const ProductRepositoryFactory =
  (dataSource: DataSource): IProductRepository => dataSource.getRepository(Product).extend({
    createOne(createProductDto: CreateProductDto): Promise<Product> {
      const product = this.create(createProductDto);
      return this.save(product);

    },

    updateOne(product: Product, updateProductDto: UpdateProductDto): Promise<Product> {
      const newProduct = this.merge(product, updateProductDto);

      return this.save(newProduct);
    },
  });
