import type { ProductDto } from '../../products/dtos';
import type { OrderDto } from './order.dto';

export class CreateOrderItemDto {

  public orderCount!: number;
  public orderPrice!: number;
  public product!: ProductDto;
  public order!: OrderDto;

}
