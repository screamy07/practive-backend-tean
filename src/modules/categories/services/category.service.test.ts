import type { Provider } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CategoryService, CategoryServiceImpl } from '.';
import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities';
import type { ICategoryRepository } from '../interfaces';
import { CategoryRepository } from '../repositories';

const CORRECT_ID = 1; const WRONG_ID = 5;
const categories = Category.fromMany([{ id: 1, name: 'Sport' }, { id: 2, name: 'Footwear' }]);

function getCategoryById(id: number): Category {
  return categories.find(category => category.id === id) as Category;
}

const mockCategoryRepositoryFactory: () => MockType<ICategoryRepository> =
  jest.fn(() => ({
    find: jest.fn().mockResolvedValue(categories),
    findOneById: jest.fn().mockResolvedValue(getCategoryById(CORRECT_ID)),
    createOne: jest.fn().mockResolvedValue(getCategoryById(CORRECT_ID)),
    updateOne: jest.fn().mockResolvedValue(getCategoryById(CORRECT_ID)),
    remove: jest.fn(),
  }));

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: ICategoryRepository;

  const categoryService: Provider = {
    provide: CategoryService,
    useClass: CategoryServiceImpl,
  };

  const categoryRepository: Provider = {
    provide: CategoryRepository,
    useFactory: mockCategoryRepositoryFactory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [categoryService, categoryRepository],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<ICategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('returns list of categories', async () => {
      const result = await service.findAllCategories();

      expect(result).toStrictEqual(categories);
    });

    it('returns empty array if there are not categories', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      const result = await service.findAllCategories();

      expect(result).toStrictEqual([]);
    });
  });

  describe('findOneCategory', () => {
    it('returns one category', async () => {
      const findSpy = jest.spyOn(repository, 'findOneById');
      const result = await service.findOneCategory(CORRECT_ID);

      expect(findSpy).toBeCalledWith({ id: CORRECT_ID });
      expect(result).toStrictEqual(getCategoryById(CORRECT_ID));
    });

    it('category by ID not found', () => {
      jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

      expect(async () => await service.findOneCategory(WRONG_ID))
        .rejects.toThrow(new NotFoundException(`Category with ID ${WRONG_ID} not found`));
    });
  });

  describe('createOneCategory', () => {
    it('creates one category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Sport' };

      const result = await service.createOneCategory(createCategoryDto);

      expect(result).toStrictEqual(getCategoryById(CORRECT_ID));
    });
  });

  describe('updateOneCategory', () => {
    it('updates one category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Sport' };

      const result = await service.updateOneCategory(CORRECT_ID, updateCategoryDto);

      expect(result).toStrictEqual(getCategoryById(CORRECT_ID));
    });
  });

  describe('deleteOneCategory', () => {
    it('deletes one product', async () => {
      const result = await service.deleteOneCategory(CORRECT_ID);

      expect(result).toBeUndefined();
    });
  });
});
