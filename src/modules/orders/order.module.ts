import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ProductModule } from '../products/product.module';
import { OrderController } from './controllers';
import {
  OrderItemRepository, OrderItemRepositoryFactory,
  OrderRepository, OrderRepositoryFactory,
} from './repositories';
import { OrderService, OrderServiceImpl } from './services';

const orderService: Provider = { provide: OrderService, useClass: OrderServiceImpl };

const orderRepository: Provider = {
  provide: OrderRepository,
  useFactory: OrderRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

const orderItemRepository: Provider = {
  provide: OrderItemRepository,
  useFactory: OrderItemRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [orderService, orderRepository, orderItemRepository],
})
export class OrderModule { }
