import type { ProductCategory } from '../entities';

export class ProductCategoryDto {

  public id!: number;
  public categoryId!: number;

  public static fromEntity(productCategory: ProductCategory): ProductCategoryDto {
    const productCategoryDto = new ProductCategoryDto();
    productCategoryDto.id = productCategory.id;
    productCategoryDto.categoryId = productCategory.category.id;

    return productCategoryDto;
  }

  public static fromEntities(productCategories: ProductCategory[]): ProductCategoryDto[] {
    const productCategoryDtos: ProductCategoryDto[] = [];

    productCategories.forEach(productCategory => productCategoryDtos.push(this.fromEntity(productCategory)));
    return productCategoryDtos;
  }

}
