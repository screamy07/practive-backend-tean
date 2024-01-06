import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { User } from '../../users/entities';

@Entity()
export class CartItem {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'int', name: 'item_count', default: 0 })
  public itemCount!: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  public static from(data: Partial<CartItem>): CartItem {
    const cartItem = new CartItem();

    cartItem.id = data.id ?? 1;
    cartItem.itemCount = data.itemCount ?? 1;
    cartItem.user = data.user ?? new User();
    cartItem.product = data.product ?? new Product();

    return cartItem;
  }

  public static fromMany(data: Partial<CartItem>[]): CartItem[] {
    return data.map(data => this.from(data));
  }

}
