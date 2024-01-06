import type { Repository } from 'typeorm';
import type { CreateOrderItemDto } from '../dtos';
import type { OrderItem } from '../entities';

interface CustomRepository {
  createOne(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem>;
}

type IOrderItemRepository = CustomRepository & Repository<OrderItem>

export type { IOrderItemRepository };
