import { IsInt, IsPositive } from 'class-validator';

export class CreateOrderDto {

  @IsPositive()
  @IsInt()
  public productId!: number;

  @IsPositive()
  @IsInt()
  public productCount!: number;

}

