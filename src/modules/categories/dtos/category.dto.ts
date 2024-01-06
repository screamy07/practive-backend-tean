import type { Category } from '../entities';

export class CategoryDto {

  public id!: number;
  public name!: string;

  public static fromEntity(category: Category): CategoryDto {
    const categoryDto = new CategoryDto();
    categoryDto.id = category.id;
    categoryDto.name = category.name;

    return categoryDto;
  }

  public static fromEntities(categories: Category[]): CategoryDto[] {
    const categoryDtos: CategoryDto[] = [];

    categories.forEach(category => categoryDtos.push(this.fromEntity(category)));
    return categoryDtos;
  }

}
