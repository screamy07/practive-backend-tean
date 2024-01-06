import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import type { Category } from '../entities';
import { ICategoryRepository } from '../interfaces';
import { CategoryRepository } from '../repositories';
import { CategoryService } from './category.service.abstract';

@Injectable()
export class CategoryServiceImpl extends CategoryService {

  constructor(@Inject(CategoryRepository) private categoryRepository: ICategoryRepository) {
    super();
  }

  public findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async findOneCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);

    return category;
  }

  public createOneCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.createOne(createCategoryDto);
  }

  public async updateOneCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOneCategory(id);

    return this.categoryRepository.updateOne(category, updateCategoryDto);
  }

  public async deleteOneCategory(id: number): Promise<void> {
    const category = await this.findOneCategory(id);

    await this.categoryRepository.remove(category);
  }

}
