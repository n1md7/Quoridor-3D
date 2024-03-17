import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Exception } from '/libs/common/src/exceptions/generic.exception';
import { ExpressRequest } from '/common/types/request.type';
import { getErrorMessage } from '/common/utils';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    return next.handle().pipe(
      catchError((error) => {
        switch (true) {
          case error instanceof Exception: {
            this.report(error, request);
            throw new HttpException(
              {
                statusCode: error.getStatus() || HttpStatus.UNPROCESSABLE_ENTITY,
                message: getErrorMessage(error),
              },
              error.getStatus() || HttpStatus.UNPROCESSABLE_ENTITY,
            );
          }
          case error instanceof HttpException: {
            this.report(error, request);
            throw new HttpException(
              {
                statusCode: error.getStatus(),
                message: getErrorMessage(error),
              },
              error.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
          default: {
            // request.logger.error(stringify(error), 'ExceptionInterceptor');
            throw new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Internal Server Error',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      }),
    );
  }

  private report(error: HttpException, request: ExpressRequest) {
    request.logger.error(`${error.message} - ${error.cause}`, {
      stackTrace: error.stack || '',
      label: 'ExceptionInterceptor',
    });
  }
}
