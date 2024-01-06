import { NotFoundException } from '@nestjs/common';
import type { Provider } from '@nestjs/common/interfaces';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrderService } from '.';
import { ProductDto } from '../../products/dtos';
import { Product } from '../../products/entities';
import { ProductService } from '../../products/services';
import { User } from '../../users/entities';
import type { CreateOrderDto, CreateOrderItemDto, UpdateOrderDto } from '../dtos';
import { OrderDto } from '../dtos';
import { Order, OrderItem } from '../entities';
import { OrderStatus } from '../entities/order-status.enum';
import type { IOrderItemRepository, IOrderRepository } from '../interfaces';
import { OrderItemRepository, OrderRepository } from '../repositories';
import { OrderServiceImpl } from './order.service';

const CORRECT_ID = 1; const WRONG_ID = 5;
let orders: Order[], orderItems: OrderItem[], users: User[], products: Product[] = [];
let completedOrders: Order[] = [];
init();

const mockOrderRepositoryFactory: () => MockType<IOrderRepository> =
  jest.fn(() => ({
    find: jest.fn().mockResolvedValue(orders),
    findOne: jest.fn().mockResolvedValue(getOrderById(CORRECT_ID)),
    createOne: jest.fn().mockResolvedValue(getOrderById(CORRECT_ID)),
    updateOne: jest.fn().mockResolvedValue(getOrderById(CORRECT_ID)),
    remove: jest.fn(),
  }));

const mockOrderItemRepositoryFactory: () => MockType<IOrderItemRepository> =
  jest.fn(() => ({
    createOne: jest.fn().mockResolvedValue(getOrderItemById(CORRECT_ID)),
  }));

describe('OrdersService', () => {
  let service: OrderService;
  let orderRepository: IOrderRepository;
  let orderItemRepository: IOrderItemRepository;
  let productService: ProductService;

  const orderServiceImpl: Provider = {
    provide: OrderService,
    useClass: OrderServiceImpl,
  };

  const productServiceImpl: Provider = {
    provide: ProductService,
    useValue: {
      findOneProduct: jest.fn().mockResolvedValue(getProductById(CORRECT_ID)),
    },
  };

  const orderRepositoryImpl: Provider = {
    provide: OrderRepository,
    useFactory: mockOrderRepositoryFactory,
  };

  const orderItemRepositoryImpl: Provider = {
    provide: OrderItemRepository,
    useFactory: mockOrderItemRepositoryFactory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [orderServiceImpl, productServiceImpl, orderRepositoryImpl, orderItemRepositoryImpl],
    }).compile();

    service = module.get<OrderService>(OrderService);
    productService = module.get<ProductService>(ProductService);
    orderRepository = module.get<IOrderRepository>(OrderRepository);
    orderItemRepository = module.get<IOrderItemRepository>(OrderItemRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllOrders', () => {
    it('returns list of orders', async () => {
      const findSpy = jest.spyOn(orderRepository, 'find');
      const findOptions = {
        relations: { items: { product: true } },
        where: { user: { id: CORRECT_ID }, status: OrderStatus.Pending },
        order: {
          id: 'asc',
        },
      };

      const result = await service.findAllOrders(CORRECT_ID, OrderStatus.Pending);

      expect(findSpy).toBeCalledWith(findOptions);
      expect(result).toStrictEqual(orders);
    });

    it('returns list of orders of completed orders', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue(completedOrders);

      const result = await service.findAllOrders(CORRECT_ID, OrderStatus.Completed);

      expect(result).toStrictEqual(completedOrders);
    });
  });

  describe('findOneOrder', () => {
    it('returns one order', async () => {
      const result = await service.findOneOrder(CORRECT_ID, CORRECT_ID);

      expect(result).toStrictEqual(getOrderById(CORRECT_ID));
    });

    it('order with ID no found', () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValueOnce(null);

      expect(async () => await service.findOneOrder(WRONG_ID, CORRECT_ID))
        .rejects.toThrow(new NotFoundException(`Order with ID ${WRONG_ID} not found`));
    });
  });

  describe('createOneOrder', () => {
    it('creates one order', async () => {
      const findOneProductSpy = jest.spyOn(productService, 'findOneProduct');
      const createOneOrderItemSpy = jest.spyOn(orderItemRepository, 'createOne');
      const createOneOrderItemOptions: CreateOrderItemDto = {
        orderCount: 1,
        orderPrice: 15,
        product: ProductDto.fromEntity(getProductById(CORRECT_ID)),
        order: OrderDto.fromEntity(getOrderById(1)),
      };
      const createOrderDtos: CreateOrderDto[] = [{ productId: CORRECT_ID, productCount: 1 }];

      const result = await service.createOneOrder(getUserById(CORRECT_ID), createOrderDtos);

      expect(findOneProductSpy).toBeCalledWith(CORRECT_ID);
      expect(createOneOrderItemSpy).toBeCalledWith(createOneOrderItemOptions);
      expect(result).toStrictEqual(getOrderById(CORRECT_ID));
    });
  });

  describe('updateOneOrder', () => {
    it('updates order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.Completed,
      };

      const result = await service.updateOneOrder(CORRECT_ID, CORRECT_ID, updateOrderDto);

      expect(result).toStrictEqual(getOrderById(CORRECT_ID));
    });
  });

  describe('deleteOneOrder', () => {
    it('deletes order', async () => {
      const result = await service.deleteOneOrder(CORRECT_ID, CORRECT_ID);

      expect(result).toBeUndefined();
    });
  });
});

function init(): void {
  users = User.fromMany([
    { id: 1, email: 'yuri@gmail.com', password: 'pass', firstName: 'Yuri', secondName: 'Holinei' },
    { id: 2, email: 'matthew@gmail.com', password: 'cool', firstName: 'Matthew', secondName: 'Jones' }]);

  products = Product.fromMany([{ id: 1, name: 'Sneakers', price: 15 }, { id: 2, name: 'Chain', price: 150 }]);

  orders = Order.fromMany([
    { id: 1, user: getUserById(1), status: OrderStatus.Pending },
    { id: 2, user: getUserById(2), status: OrderStatus.Completed }]);

  orderItems = OrderItem.fromMany([
    { id: 1, orderPrice: 15, product: getProductById(1), order: getOrderById(1) },
    { id: 2, orderPrice: 150, product: getProductById(2), order: getOrderById(1) }]);

  orders = orders.map(order => {
    order.items = orderItems.filter(orderItem => orderItem.order === order);
    return order;
  });

  completedOrders = orders.filter(order => order.status === OrderStatus.Completed);
}

function getUserById(id: number): User {
  return users.find(user => user.id === id) as User;
}

function getProductById(id: number): Product {
  return products.find(product => product.id === id) as Product;
}

function getOrderById(id: number): Order {
  return orders.find(order => order.id === id) as Order;
}

function getOrderItemById(id: number): OrderItem {
  return orderItems.find(orderItem => orderItem.id === id) as OrderItem;
}

