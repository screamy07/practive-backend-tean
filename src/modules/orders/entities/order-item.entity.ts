import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { Order } from '.';

@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'int', name: 'order_count' })
  public orderCount!: number;

  @Column({ type: 'money', name: 'order_price' })
  public orderPrice!: number;

  @ManyToOne(() => Product, (product) => product.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  public order!: Order;

  public static from(data: Partial<OrderItem>): OrderItem {
    const orderItem = new OrderItem();

    orderItem.id = data.id ?? 1;
    orderItem.orderCount = data.orderCount ?? 1;
    orderItem.orderPrice = data.orderPrice ?? 0;
    orderItem.order = data.order ?? new Order();
    orderItem.product = data.product ?? new Product();

    return orderItem;
  }

  public static fromMany(data: Partial<OrderItem>[]): OrderItem[] {
    return data.map(data => this.from(data));
  }

}
