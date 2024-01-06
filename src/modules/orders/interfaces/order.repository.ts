import type { Repository } from 'typeorm';
import type { UpdateOrderDto } from '../dtos';
import type { Order } from '../entities';
import type { User } from '../../users/entities';

interface CustomRepository {
  createOne(user: User): Promise<Order>;
  updateOne(order: Order, updateOrderDto: UpdateOrderDto): Promise<Order>;
}

type IOrderRepository = CustomRepository & Repository<Order>

export type { IOrderRepository };
