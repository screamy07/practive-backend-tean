import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { PhotoController } from './controllers';
import { CategoryModule } from '../categories/category.module';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';
import { PhotoService, PhotoServiceImpl } from './services';
import { PhotoRepository, PhotoRepositoryFactory } from './repositories';

const photoService: Provider = { provide: PhotoService, useClass: PhotoServiceImpl };

const photoRepository: Provider = {
  provide: PhotoRepository,
  useFactory: PhotoRepositoryFactory,
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [UserModule, ProductModule, CategoryModule],
  controllers: [PhotoController],
  providers: [photoService, photoRepository],
})
export class PhotoModule { }
