import { IsInt, IsPositive } from 'class-validator';

export class CreateCartItemDto {

  @IsPositive()
  @IsInt()
  public productId!: number;

  @IsPositive()
  @IsInt()
  public itemCount: number = 1;

}
