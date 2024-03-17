#!/usr/bin/env node

import {
  configureCors,
  configureFilters,
  configureInterceptors,
  configureLogger,
  configureMiddlewares,
  configurePipes,
  configureSignals,
  configureVersioning,
  disableExpressSignature,
  setupSwagger,
} from '/common/bootstrap';
import { ConfigService } from '/common/configuration/config.service';
import { Env } from '/common/environment/env';
import { exitProcess, logger } from '/common/utils';
import { AppModule } from '/src/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { pid } from 'node:process';
import { name, version } from '../package.json';
import { cli } from '/common/cli';

(async () => {
  configureSignals();

  if (cli.argsProvided()) cli.argsParse();

  return bootstrap(cli.getAppPort());
})().catch(exitProcess);

async function bootstrap(cliPort: number) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  configurePipes(app);
  configureVersioning(app);
  configureMiddlewares(app);
  configureInterceptors(app);
  configureLogger(app);
  configureFilters(app);
  configureCors(app);
  setupSwagger(app);
  disableExpressSignature(app);

  const appPort = cliPort || config.getOrThrow('http.port', { infer: true });

  await app.listen(appPort, '0.0.0.0');

  const url = await app.getUrl();

  logger.info(`

    Application(${name.toUpperCase()}) started at: ${url}
    Swagger docs: ${url}/docs
    Mode: ${Env.NodeEnv}
    Version: ${version}
    Pid: ${pid}
  `);
}
