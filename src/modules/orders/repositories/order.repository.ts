import type { DataSource } from 'typeorm';
import type { User } from '../../users/entities';
import type { UpdateOrderDto } from '../dtos';
import { Order } from '../entities';
import type { IOrderRepository } from '../interfaces';

export const OrderRepository = Symbol('ORDER_REPOSITORY');

export const OrderRepositoryFactory = (dataSource: DataSource): IOrderRepository =>
  dataSource.getRepository(Order).extend({
    createOne(user: User): Promise<Order> {
      const order = this.create({ user });

      return this.save(order);
    },

    updateOne(order: Order, updateOrderDto: UpdateOrderDto): Promise<Order> {
      const mergedOrder = this.merge(order, updateOrderDto);

      return this.save(mergedOrder);
    },
  });
