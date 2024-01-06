import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import type { Category } from '../entities';

export abstract class CategoryService {

  public abstract findAllCategories(): Promise<Category[]>;
  public abstract findOneCategory(id: number): Promise<Category>;
  public abstract createOneCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
  public abstract updateOneCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
  public abstract deleteOneCategory(id: number): Promise<void>;

}
