import { validationOptions, validationSchema } from '/common/validations/env-validation.schema';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Configuration } from './configuration';
import { env } from 'node:process';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${env.NODE_ENV}`,
      load: [Configuration],
      cache: true,
      validationSchema,
      validationOptions,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
