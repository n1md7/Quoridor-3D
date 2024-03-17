import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CorsException } from '../exceptions/cors.exception';
import { ExpressRequest } from '/common/types/request.type';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<ExpressRequest>();

    if (exception instanceof CorsException) {
      request.logger.error(exception.message, 'Exception.filter(CORS)');
      return response.status(HttpStatus.NO_CONTENT).send();
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    return response.status(500).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
