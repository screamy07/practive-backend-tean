import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../products/entities';

@Entity()
export class Category {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  public name!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
  public products!: ProductCategory[];

  public static from(data: Partial<Category>): Category {
    const category = new Category();
    category.id = data.id ?? 1;
    category.name = data.name ?? '';
    category.products = data.products ?? [];

    return category;
  }

  public static fromMany(data: Partial<Category>[]): Category[] {
    return data.map(data => this.from(data));
  }

}
