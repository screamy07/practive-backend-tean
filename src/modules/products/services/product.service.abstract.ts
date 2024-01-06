
import type { CreateProductDto, UpdateProductDto } from '../dtos';
import type { ProductQuery } from '../dtos';
import type { Product } from '../entities';

export abstract class ProductService {

  public abstract findAllProducts(query: ProductQuery): Promise<Product[]>;
  public abstract findOneProduct(id: number): Promise<Product>;
  public abstract createOneProduct(createProductDto: CreateProductDto): Promise<Product>;
  public abstract updateOneProduct(id: number, updateOneProduct: UpdateProductDto): Promise<Product>
  public abstract deleteOneProduct(id: number): Promise<void>

}
