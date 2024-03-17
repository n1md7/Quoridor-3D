import { logger } from '/common/utils';
import { LoggerService } from '@nestjs/common';

export class LoggerOverride implements LoggerService {
  private readonly logger = logger;

  log(message: any, label: string) {
    this.logger.info(message, label);
  }

  fatal(message: any, label: string) {
    this.logger.error(message, label);
  }

  error(message: any, label: string) {
    this.logger.error(message, label);
  }

  warn(message: any, label: string) {
    this.logger.warn(message, label);
  }

  debug(message: any, label: string) {
    this.logger.debug(message, label);
  }

  verbose?() {}
}
