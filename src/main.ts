import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './@framework/filters/http-exception.filter';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true, logger: ['warn', 'error', 'log', 'debug', 'verbose'],
  });

  // initialize validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new HttpExceptionFilter());

  // getting .env port
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') ?? 5000;

  config.update({
    credentials: {
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') as string,
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') as string,
    },
    region: configService.get<string>('AWS_REGION'),
  });

  // swagger initialize
  const documentConfig = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('The marketplace API description for documentation of API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(port);
}
bootstrap();
