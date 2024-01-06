import type { DataSource } from 'typeorm';
import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities';
import type { ICategoryRepository } from '../interfaces';

export const CategoryRepository = Symbol('CATEGORY_REPOSITORY');

export const CategoryRepositoryFactory =
  (dataSource: DataSource): ICategoryRepository => dataSource.getRepository(Category).extend({

    async createOne(createCategoryDto: CreateCategoryDto): Promise<Category> {
      const category = this.create(createCategoryDto);

      return this.save(category);
    },

    async updateOne(category: Category, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
      const mergedCategory = this.merge(category, updateCategoryDto);

      return this.save(mergedCategory);
    },
  });
