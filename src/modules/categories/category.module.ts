import { Module } from '@nestjs/common';
import { CategoryController } from './controllers';
import { CategoryRepository, CategoryRepositoryFactory } from './repositories';
import { CategoryService, CategoryServiceImpl } from './services';

const categoryService = { provide: CategoryService, useClass: CategoryServiceImpl };

const categoryRepository = {
  provide: CategoryRepository,
  useFactory: CategoryRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [],
  exports: [categoryService],
  controllers: [CategoryController],
  providers: [categoryService, categoryRepository],
})
export class CategoryModule { }
