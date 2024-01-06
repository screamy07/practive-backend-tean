import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../@framework/decorators';
import { CartItem } from '../../cart/entities';
import { Order } from '../../orders/entities';

@Entity()
export class User {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  public email!: string;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  public isVerified!: boolean;

  @Column({ type: 'varchar', length: 100 })
  public password!: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  public firstName!: string;

  @Column({ type: 'varchar', length: 50, name: 'second_name' })
  public secondName!: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  public role!: Role;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;

  @OneToMany(() => Order, (order) => order.user)
  public orders!: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  public cartItems!: CartItem[];

  public static from(data: Partial<User> & Pick<User, 'email' | 'password'>): User {
    const user = new User();

    user.id = data.id ?? 1;
    user.email = data.email;
    user.isVerified = data.isVerified ?? false;
    user.password = data.password;
    user.firstName = data.firstName ?? '';
    user.secondName = data.secondName ?? '';
    user.role = data.role ?? Role.User;
    user.orders = data.orders ?? [];
    user.cartItems = data.cartItems ?? [];

    return user;
  }

  public static fromMany(data: (Partial<User> & Pick<User, 'email' | 'password'>)[]): User[] {
    return data.map(data => this.from(data));
  }

}
