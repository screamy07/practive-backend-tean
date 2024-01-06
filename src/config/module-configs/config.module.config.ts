import type { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

const configModuleConfig: ConfigModule = {
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    DB_TYPE: Joi.valid(
      'mysql',
      'postgres',
      'cockroachdb',
      'mariadb',
      'sqlite',
      'mssql',
      'mongodb',
    ).default('postgres'),
    DB_VERSION: Joi.valid(Joi.number(), 'latest').default('latest'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_NAME: Joi.string(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    PGADMIN_EMAIL: Joi.string().email(),
    PGADMIN_PASSWORD: Joi.string(),
    PGADMIN_PORT: Joi.number().default(5050),
    JWT_SECRET_KEY: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_BUCKET: Joi.string().required(),
  }),
};

export { configModuleConfig };
