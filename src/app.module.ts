import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { configModuleConfig } from './config/module-configs/config.module.config';
import {
  AuthModule, CartItemModule, CategoryModule,
  OrderModule, PhotoModule, ProductModule, UserModule,
} from './modules';

const dataSourceService: Provider = {
  provide: 'DATA_SOURCE',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DataSource> => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      database: configService.get<string>('DB_NAME'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      entities: ['dist/**/entities/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      logging: true,
      synchronize: true,
    });

    return dataSource.initialize();
  },
};

@Global()
@Module({
  imports: [
    TypeOrmModule,
    ConfigModule.forRoot(configModuleConfig),
    ProductModule,
    UserModule,
    AuthModule,
    CartItemModule,
    PhotoModule,
    CategoryModule,
    OrderModule,
  ],
  exports: [dataSourceService],
  controllers: [],
  providers: [dataSourceService],
})
export class AppModule { }
