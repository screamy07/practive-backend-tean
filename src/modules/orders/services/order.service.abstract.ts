import type { User } from '../../users/entities';
import type { CreateOrderDto, UpdateOrderDto } from '../dtos';
import type { Order } from '../entities';
import type { OrderStatus } from '../entities/order-status.enum';

export abstract class OrderService {

  public abstract findAllOrders(userId: number, status: OrderStatus): Promise<Order[]>;
  public abstract findOneOrder(id: number, userId: number): Promise<Order>;
  public abstract createOneOrder(user: User, createOrderDtos: CreateOrderDto[]): Promise<Order>;
  public abstract updateOneOrder(id: number, userId: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
  public abstract deleteOneOrder(id: number, userId: number): Promise<void>;

}
