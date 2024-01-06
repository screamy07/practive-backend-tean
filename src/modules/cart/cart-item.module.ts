import { Module } from '@nestjs/common';
import { ProductModule } from '../products/product.module';
import { CartItemController } from './controllers';
import { CartItemRepository, CartItemRepositoryFactory } from './repositories';
import { CartItemService, CartItemServiceImpl } from './services';

const cartItemService = { provide: CartItemService, useClass: CartItemServiceImpl };

const cartItemRepository = {
  provide: CartItemRepository,
  useFactory: CartItemRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [ProductModule],
  controllers: [CartItemController],
  providers: [cartItemService, cartItemRepository],
})
export class CartItemModule { }
