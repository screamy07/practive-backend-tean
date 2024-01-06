import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities';
import { OrderItem } from '.';
import { OrderStatus } from './order-status.enum';

@Entity()
export class Order {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  public status!: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public items!: OrderItem[];

  public static from(data: Partial<Order>): Order {
    const order = new Order();

    order.id = data.id ?? 1;
    order.status = data.status ?? OrderStatus.Pending;
    order.items = data.items ?? [];
    order.user = data.user ?? new User();

    return order;
  }

  public static fromMany(data: Partial<Order>[]): Order[] {
    return data.map(data => this.from(data));
  }

}
