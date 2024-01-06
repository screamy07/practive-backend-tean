import type { OrderItem } from '../entities';

export class OrderItemDto {

  public id!: number;
  public orderCount!: number;
  public orderPrice!: number;
  public productId!: number;

  public static fromEntity(orderItem: OrderItem): OrderItemDto {
    const orderItemDto = new OrderItemDto();
    orderItemDto.orderCount = orderItem.orderCount;
    orderItemDto.orderPrice = orderItem.orderPrice;
    orderItemDto.productId = orderItem.product.id;

    return orderItemDto;
  }

  public static fromEntities(orderItems: OrderItem[]): OrderItemDto[] {
    const orderItemDtos: OrderItemDto[] = [];

    orderItems.forEach(orderItem => orderItemDtos.push(this.fromEntity(orderItem)));
    return orderItemDtos;
  }

}
