import type { Provider } from '@nestjs/common/interfaces';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ProductService } from '../../../modules/products/services';
import { Product } from '../../../modules/products/entities';
import { User } from '../../../modules/users/entities';
import type { CreateCartItemDto } from '../dtos';
import { CartItem } from '../entities';
import type { ICartItemRepository } from '../interfaces';
import { CartItemRepository } from '../repositories';
import { CartItemServiceImpl } from './cart-item.service';
import { CartItemService } from './cart-item.service.abstract';
import { NotFoundException } from '@nestjs/common';

const CORRECT_CART_ITEM_ID = 1, WRONG_CART_ITEM_ID = 5, WRONG_ITEM_COUNT_ID = 2;
const CORRECT_USER_ID = 1;
const CORRECT_PRODUCT_ID = 1;

let cartItems: CartItem[], products: Product[], users: User[];
init();

const mockCartItemRepositoryFactory: () => MockType<ICartItemRepository> =
  jest.fn(() => ({
    find: jest.fn().mockResolvedValue(cartItems),
    findOne: jest.fn().mockResolvedValue(getCartItemById(CORRECT_CART_ITEM_ID)),
    createOne: jest.fn().mockResolvedValue(getCartItemById(CORRECT_CART_ITEM_ID)),
    increment: jest.fn(),
    remove: jest.fn(),
  }));

describe('CartItemService', () => {
  let service: CartItemService;
  let repository: ICartItemRepository;
  let productService: ProductService;

  const cartItemServiceImpl: Provider = {
    provide: CartItemService,
    useClass: CartItemServiceImpl,
  };

  const cartItemRepository: Provider = {
    provide: CartItemRepository,
    useFactory: mockCartItemRepositoryFactory,
  };

  const productServiceImpl: Provider = {
    provide: ProductService,
    useValue: {
      findOneProduct: jest.fn().mockResolvedValue(getProductById(CORRECT_CART_ITEM_ID)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [cartItemServiceImpl, productServiceImpl, cartItemRepository],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    repository = module.get<ICartItemRepository>(CartItemRepository);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCartItems', () => {
    it('returns list of cart items', async () => {
      const findSpy = jest.spyOn(repository, 'find');
      const findOptions = {
        relations: { product: true },
        where: { user: { id: CORRECT_USER_ID } },
      };

      const result = await service.findAllCartItems(CORRECT_USER_ID);

      expect(findSpy).toBeCalledWith(findOptions);
      expect(result).toStrictEqual(cartItems);
    });
  });

  describe('findOneCartItem', () => {
    it('returns one cart item', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOne');
      const findOneOptions = {
        relations: { product: true },
        where: { id: CORRECT_CART_ITEM_ID, user: { id: CORRECT_USER_ID } },
      };

      const result = await service.findOneCartItem(CORRECT_CART_ITEM_ID, CORRECT_USER_ID);

      expect(findOneSpy).toBeCalledWith(findOneOptions);
      expect(result).toStrictEqual(getCartItemById(CORRECT_CART_ITEM_ID));
    });

    it('cart item with ID not found', () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      expect(async () => await service.findOneCartItem(WRONG_CART_ITEM_ID, CORRECT_USER_ID))
        .rejects.toThrow(new NotFoundException(`Cart item with ID ${WRONG_CART_ITEM_ID} not found`));
    });
  });

  describe('createOneCartItem', () => {
    it('creates one cart item', async () => {
      const findOneProductSpy = jest.spyOn(productService, 'findOneProduct');
      const createCartItemDto: CreateCartItemDto = {
        productId: CORRECT_PRODUCT_ID, itemCount: 1,
      };

      const result = await service.createOneCartItem(getUserById(CORRECT_USER_ID), createCartItemDto);

      expect(findOneProductSpy).toBeCalledWith(CORRECT_PRODUCT_ID);
      expect(result).toStrictEqual(getCartItemById(CORRECT_CART_ITEM_ID));
    });

    it('item count is below zero and cart item is deleted', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(getCartItemById(WRONG_ITEM_COUNT_ID));
      const createCartItemDto: CreateCartItemDto = {
        productId: CORRECT_PRODUCT_ID, itemCount: -2,
      };

      const result = await service.createOneCartItem(getUserById(CORRECT_USER_ID), createCartItemDto);

      expect(result).toBeNull();
    });
  });

  describe('deleteOneCartItem', () => {
    it('deletes cart item', async () => {
      const result = await service.deleteOneCartItem(CORRECT_CART_ITEM_ID, CORRECT_USER_ID);

      expect(result).toBeUndefined();
    });
  });
});

function init(): void {
  users = User.fromMany([
    { id: 1, email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei' },
    { id: 2, email: 'matthew@gmail.com', password: 'cool', firstName: 'Matthew', secondName: 'Jones' }]);

  products = Product.fromMany([{ id: 1, name: 'Sneakers', price: 15 }, { id: 2, name: 'Chain', price: 150 }]);

  cartItems = CartItem.fromMany([
    { id: 1, product: getProductById(1), user: getUserById(1) },
    { id: 2, itemCount: -2, product: getProductById(2), user: getUserById(1) },
  ]);
}

function getUserById(id: number): User {
  return users.find(user => user.id === id) as User;
}

function getProductById(id: number): Product {
  return products.find(product => product.id === id) as Product;
}

function getCartItemById(id: number): CartItem {
  return cartItems.find(cartItem => cartItem.id === id) as CartItem;
}
