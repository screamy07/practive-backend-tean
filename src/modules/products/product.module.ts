import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CategoryModule } from '../categories/category.module';
import { ProductController } from './controllers';
import {
  ProductCategoryRepository, ProductCategoryRepositoryFactory,
  ProductRepository, ProductRepositoryFactory,
} from './repositories';
import { ProductService, ProductServiceImpl } from './services';

const productService: Provider = { provide: ProductService, useClass: ProductServiceImpl };

const productCategoryRepository: Provider = {
  provide: ProductCategoryRepository,
  useFactory: ProductCategoryRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

const productRepository: Provider = {
  provide: ProductRepository,
  useFactory: ProductRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [CategoryModule],
  exports: [productService],
  controllers: [ProductController],
  providers: [productService, productRepository, productCategoryRepository],
})
export class ProductModule { }
