import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Category } from '../../categories/entities';
import type { CreateProductDto, ProductQuery, UpdateProductDto } from '../dtos';
import type { IProductCategoryRepository, IProductRepository } from '../interfaces';
import { ProductService } from './product.service.abstract';
import { ProductCategory } from '../entities';
import { Product } from '../entities';
import type { Provider } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ProductServiceImpl } from './product.service';
import { CategoryService } from '../../categories/services';
import { ProductCategoryRepository, ProductRepository } from '../repositories';
import type { FindOneOptions } from 'typeorm';

const CORRECT_PRODUCT_ID = 1; const WRONG_PRODUCT_ID = 5;
const CORRECT_PRODUCT_CATEGORY_ID = 1;
const CORRECT_CATEGORY_ID = 1;

let products: Product[], productCategories: ProductCategory[], categories: Category[] = [];
init();

const mockProductRepositoryFactory: () => MockType<IProductRepository> =
  jest.fn(() => ({
    find: jest.fn().mockResolvedValue(products),
    findOne: jest.fn().mockResolvedValue(getProductById(CORRECT_PRODUCT_ID)),
    findOneById: jest.fn().mockResolvedValue(getProductById(CORRECT_PRODUCT_ID)),
    createOne: jest.fn().mockResolvedValue(getProductById(CORRECT_PRODUCT_ID)),
    updateOne: jest.fn().mockResolvedValue(getProductById(CORRECT_PRODUCT_ID)),
    remove: jest.fn(),
  }));

const mockProductCategoryRepositoryFactory: () => MockType<IProductCategoryRepository> =
  jest.fn(() => ({
    createOne: jest.fn().mockResolvedValue(getProductCategoryById(CORRECT_PRODUCT_CATEGORY_ID)),
    remove: jest.fn(),
  }));

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: IProductRepository;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const productServiceImpl: Provider = {
      provide: ProductService,
      useClass: ProductServiceImpl,
    };
    const categoryServiceImpl: Provider = {
      provide: CategoryService,
      useValue: {
        findOneCategory: jest.fn().mockResolvedValue(getCategoryById(CORRECT_CATEGORY_ID)),
      },
    };
    const productRepositoryProvider: Provider = {
      provide: ProductRepository,
      useFactory: mockProductRepositoryFactory,
    };
    const productCategoryRepository: Provider = {
      provide: ProductCategoryRepository,
      useFactory: mockProductCategoryRepositoryFactory,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [productServiceImpl, categoryServiceImpl,
        productRepositoryProvider, productCategoryRepository],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<IProductRepository>(ProductRepository);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  describe('findAllProducts', () => {
    it('returns list of products with filtering', async () => {
      const options: ProductQuery = { name: 'Sneakers', page: 1, perPage: 1, categories: [1, 2] };

      const findSpy = jest.spyOn(productRepository, 'find');
      const result = await productService.findAllProducts(options);

      expect(findSpy).toBeCalledTimes(1);
      expect(result).toStrictEqual(products);
    });

    it('returns list of products without filtering', async () => {
      const result = await productService.findAllProducts({});

      expect(result).toStrictEqual(products);
    });

    it('cannot match any of filter', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);
      const options: ProductQuery = { name: 'Hats', page: 1, perPage: 1, categories: [1, 2] };

      const result = await productService.findAllProducts(options);

      expect(result).toStrictEqual([]);
    });
  });

  describe('findOneProduct', () => {
    it('returns one product by ID', async () => {
      const findOneSpy = jest.spyOn(productRepository, 'findOne');
      const findOneOptions: FindOneOptions<Product> = {
        relations: { categories: { category: true } },
        where: { id: CORRECT_PRODUCT_ID },
      };
      const result = await productService.findOneProduct(CORRECT_PRODUCT_ID);

      expect(findOneSpy).toBeCalledWith(findOneOptions);
      expect(result).toStrictEqual(getProductById(CORRECT_PRODUCT_ID));
    });

    it('product with id not found', () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

      expect(async () => await productService.findOneProduct(WRONG_PRODUCT_ID))
        .rejects.toThrow(new NotFoundException(`Product with ID ${WRONG_PRODUCT_ID} not found`));
    });
  });

  describe('createOneProduct', () => {
    it('creates one product', async () => {
      const findCategorySpy = jest.spyOn(categoryService, 'findOneCategory');
      const createProductDto: CreateProductDto = {
        name: 'Sneakers', price: 15, categoryIds: [1, 2],
      };

      const result = await productService.createOneProduct(createProductDto);
      expect(result).toStrictEqual(getProductById(CORRECT_PRODUCT_ID));
      expect(findCategorySpy).toBeCalledWith(CORRECT_CATEGORY_ID);
    });

    it('cannot found category to create product', () => {
      jest.spyOn(categoryService, 'findOneCategory')
        .mockImplementationOnce(() => Promise.reject(new NotFoundException()));
      const createProductDto: CreateProductDto = {
        name: 'Sneakers', price: 15, categoryIds: [9],
      };

      expect(async () => await productService.createOneProduct(createProductDto))
        .rejects.toThrow(new NotFoundException());
    });
  });

  describe('updateOneProduct', () => {
    it('updates product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Sneakers', price: 15, categoryIds: [1, 2],
      };

      const result = await productService.updateOneProduct(CORRECT_PRODUCT_ID, updateProductDto);
      expect(result).toStrictEqual(getProductById(CORRECT_PRODUCT_ID));
    });
  });

  describe('deleteOneProduct', () => {
    it('deletes one product', async () => {
      const result = await productService.deleteOneProduct(CORRECT_PRODUCT_ID);

      expect(result).toBeUndefined();
    });
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });
});

function init(): void {
  products = Product.fromMany([{ id: 1, name: 'Sneakers', price: 15 }, { id: 2, name: 'Chain', price: 150 }]);

  categories = Category.fromMany([
    { id: 1, name: 'Sport' }, { id: 2, name: 'Footwear' }, { id: 3, name: 'Accessories' }, { id: 4, name: 'Gold' }]);

  productCategories = ProductCategory.fromMany([
    { id: 1, category: getCategoryById(1), product: getProductById(1) },
    { id: 2, category: getCategoryById(2), product: getProductById(1) },
    { id: 3, category: getCategoryById(3), product: getProductById(2) },
    { id: 4, category: getCategoryById(4), product: getProductById(2) },
  ]);

  products = products.map(product => {
    product.categories = productCategories.filter(productCategory => productCategory.product === product);
    return product;
  });
}

function getProductById(id: number): Product {
  return products.find(product => product.id === id) as Product;
}

function getProductCategoryById(id: number): ProductCategory {
  return productCategories.find(productCategory => productCategory.id === id) as ProductCategory;
}

function getCategoryById(id: number): Category {
  return categories.find(category => category.id === id) as Category;
}
