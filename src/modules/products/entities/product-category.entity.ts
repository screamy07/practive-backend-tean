import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';
import { Category } from '../../categories/entities';

@Entity()
export class ProductCategory {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @ManyToOne(() => Product, (product) => product.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  public category!: Category;

  public static from(data: Partial<ProductCategory>): ProductCategory {
    const productCategory = new ProductCategory();

    productCategory.id = data.id ?? 1;
    productCategory.product = data.product ?? Product.from({});
    productCategory.category = data.category ?? Category.from({});

    return productCategory;
  }

  public static fromMany(data: Partial<ProductCategory>[]): ProductCategory[] {
    return data.map(data => this.from(data));
  }

}
