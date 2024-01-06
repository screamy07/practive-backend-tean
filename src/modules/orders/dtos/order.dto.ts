import { OrderItemDto } from '.';
import type { OrderStatus } from '../entities/order-status.enum';
import type { Order } from '../entities';

export class OrderDto {

  public id!: number;
  public status!: OrderStatus;
  public createdAt!: Date;
  public updatedAt!: Date;
  public items!: OrderItemDto[];

  public static fromEntity(order: Order): OrderDto {
    const orderDto = new OrderDto();
    orderDto.id = order.id;
    orderDto.status = order.status;
    orderDto.createdAt = order.createdAt;
    orderDto.updatedAt = order.updatedAt;
    orderDto.items = OrderItemDto.fromEntities(order.items);

    return orderDto;
  }

  public static fromEntities(orders: Order[]): OrderDto[] {
    const orderDtos: OrderDto[] = [];

    orders.forEach(order => orderDtos.push(this.fromEntity(order)));
    return orderDtos;
  }

}
