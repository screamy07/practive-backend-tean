import type { DataSource } from 'typeorm';
import type { CreateOrderItemDto } from '../dtos';
import { OrderItem } from '../entities';
import type { IOrderItemRepository } from '../interfaces';

export const OrderItemRepository = Symbol('ORDER_ITEM_REPOSITORY');

export const OrderItemRepositoryFactory = (dataSource: DataSource): IOrderItemRepository =>
  dataSource.getRepository(OrderItem).extend({
    createOne(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
      const orderItem = this.create(createOrderItemDto);

      return this.save(orderItem);
    },
  });
