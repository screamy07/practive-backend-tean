import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FindOptionsRelations } from 'typeorm';
import { In, Like } from 'typeorm';
import { CategoryService } from '../../categories/services';
import type { CreateProductDto, ProductQuery, UpdateProductDto } from '../dtos';
import type { Product, ProductCategory } from '../entities';
import { IProductCategoryRepository, IProductRepository } from '../interfaces';
import { ProductCategoryRepository, ProductRepository } from '../repositories';
import { ProductService } from './product.service.abstract';

@Injectable()
export class ProductServiceImpl extends ProductService {

  private _relationOptions: FindOptionsRelations<Product> = {
    categories: {
      category: true,
    },
  };

  constructor(
    @Inject(ProductRepository) private readonly productRepository: IProductRepository,
    @Inject(ProductCategoryRepository) private readonly productCategoryRepository: IProductCategoryRepository,
    @Inject(CategoryService) private readonly categoryService: CategoryService,
  ) {
    super();
  }

  public async findAllProducts(query: ProductQuery): Promise<Product[]> {
    const skip = (query.page && query.perPage) && (query.page - 1) * query.perPage;
    const take = query.perPage;

    // const products = await this.productRepository.createQueryBuilder('product')
    //   .leftJoinAndSelect('product.categories', 'productCategories', 'product.id = productCategories.product_id')
    //   .leftJoinAndSelect('productCategories.category', 'category', 'productCategories.category_id = category.id')
    //   .leftJoinAndSelect
    //    ('productCategories.category', 'categorySelect', 'productCategories.category_id = category.id')
    //   .where('product.name LIKE :name', { name: `${name}%` })
    //   .andWhere('category.id IN (:...productCategories)', { productCategories: categories })
    //   .orderBy('product.id', 'ASC')
    //   .skip(skip)
    //   .take(take)
    //   .getMany();

    // return products;

    return this.productRepository.find({
      relations: this._relationOptions,
      where: {
        name: Like(`${query.name}%`),
        categories: {
          category: {
            id: query.categories && In(query.categories),
          },
        },
      },
      order: {
        id: 'asc',
      },
      skip,
      take,
    });
  }

  public async findOneProduct(id: number): Promise<Product> {

    const product = await this.productRepository.findOne({
      relations: this._relationOptions,
      where: { id },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }

  public async createOneProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.createOne(createProductDto);

    if (createProductDto.categoryIds.length > 0) {
      const newProductCategories: ProductCategory[] = [];

      for (const id of createProductDto.categoryIds) {
        const category = await this.categoryService.findOneCategory(id);
        newProductCategories.push(await this.productCategoryRepository.createOne(product, category));
      }

      product.categories = newProductCategories;
      return this.findOneProduct(product.id);
    }

    return product;
  }

  public async updateOneProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneProduct(id);

    if (updateProductDto.categoryIds && updateProductDto.categoryIds.length > 0) {
      await this.productCategoryRepository.remove(product.categories);

      const newProductCategories: ProductCategory[] = [];

      for (const id of updateProductDto.categoryIds) {
        const category = await this.categoryService.findOneCategory(id);
        newProductCategories.push(await this.productCategoryRepository.createOne(product, category));
      }

      product.categories = newProductCategories;
    }

    return this.productRepository.updateOne(product, updateProductDto);
  }

  public async deleteOneProduct(id: number): Promise<void> {
    const product = await this.findOneProduct(id);

    await this.productRepository.remove(product);
  }

}
