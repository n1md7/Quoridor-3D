import { Env } from '/common/environment/env';
import { CorsException } from '/common/exceptions/cors.exception';
import { HttpExceptionsFilter } from '/common/filters/exception.filter';
import { ExceptionInterceptor } from '/common/interceptors/exception-handler.interceptor';
import { RequestInterceptor } from '/common/interceptors/request.interceptor';
import { essentials } from '/common/middlewares/essential.middleware';
import { exitProcess, getErrorMessage, logger } from '/common/utils';
import { LoggerOverride } from '/common/utils/logger/logger.override';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '/package.json';
import fs from 'fs';
import yaml from 'js-yaml';
import { env } from 'node:process';
import pinoHttp from 'pino-http';

export function configureVersioning(app: NestExpressApplication) {
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}

export function configureMiddlewares(app: NestExpressApplication | INestApplication) {
  app.use(essentials);
  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          colorizeObjects: true,
        },
      },
    }),
  );
}

export function configurePipes(app: NestExpressApplication | INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

export function configureInterceptors(app: NestExpressApplication | INestApplication) {
  app.useGlobalInterceptors(new RequestInterceptor(), new ExceptionInterceptor());
}

export function configureFilters(app: NestExpressApplication | INestApplication) {
  app.useGlobalFilters(new HttpExceptionsFilter());
}

export function configureLogger(app: NestExpressApplication | INestApplication) {
  app.useLogger(new LoggerOverride());
}

export function configureCors(app: NestExpressApplication | INestApplication) {
  const corsWhitelist = env.ORIGIN?.split(',') || [];
  logger.info(`Enabling following origins: ${corsWhitelist.join(', ') || null}`, 'InstanceLoader');
  app.enableCors({
    origin: function (origin, callback) {
      const originNotDefined = !origin;
      const isWhitelisted = corsWhitelist.indexOf(origin) !== -1;
      const isLocalhost = new RegExp(/^https?:\/\/(localhost|127.0.0.1)/).test(origin);
      if (originNotDefined || isLocalhost || isWhitelisted) {
        callback(null, true);
      } else {
        callback(new CorsException(`Origin [${origin}] Not allowed by CORS`));
      }
    },
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type, X-SESSION-ID, X-REQUEST-ID',
    exposedHeaders: 'Authorization',
    credentials: true,
  });
}

export function configureSignals() {
  const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

  signalsNames.forEach((signalName) =>
    process.on(signalName, (signal) => {
      logger.info(`Retrieved signal: ${signal}, application terminated`, {
        label: 'SignalHandler',
      });
      exitProcess(`Signal: ${signal}`);
    }),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught Exception, error: ${getErrorMessage(error)}`, {
      stackTrace: error.stack,
      label: 'UncaughtException',
    });
    exitProcess(error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection, reason: ${getErrorMessage(reason)}`);
    promise.catch((error: Error) => {
      logger.error(error.message, { stackTrace: error.stack, label: 'UnhandledRejection' });
      exitProcess(error);
    });
  });
}

export function setupSwagger(app: NestExpressApplication | INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(name.toUpperCase())
    .setDescription(description)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (Env.isDev) {
    try {
      const yamlString: string = yaml.dump(document);
      fs.writeFileSync('./docs/swagger.yaml', yamlString);
    } catch (error) {
      logger.error(`Error while writing swagger.yaml file: ${error}`, 'InstanceLoader');
    }
  }
  SwaggerModule.setup('docs', app, document);
}

export function disableExpressSignature(app: NestExpressApplication | INestApplication) {
  app.getHttpAdapter().getInstance().disable('x-powered-by');
}
