import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/order-status.enum';

export class UpdateOrderDto {

  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;

}
