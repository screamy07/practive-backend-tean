import type { Repository } from 'typeorm';
import type { CreateProductDto, UpdateProductDto } from '../dtos';
import type { Product } from '../entities';

interface CustomRepository {
  createOne(createProductDto: CreateProductDto): Promise<Product>;
  updateOne(product: Product, updateProductDto: UpdateProductDto): Promise<Product>;
}

type IProductRepository = CustomRepository & Repository<Product>;

export type { IProductRepository };
