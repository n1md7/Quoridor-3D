import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Env } from '/common/environment/env';
import { ExpressRequest } from '/common/types/request.type';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const response = context.switchToHttp().getResponse();

    const text = { started: 'Started', completed: 'Completed', payload: 'Payload' };

    const { ip, method, originalUrl } = request;
    const userAgent = (Env.isProd && request.get('user-agent')) || '';

    response.on('finish', () => {
      const ended = Date.now();
      const delta = ended - request.startedAt;
      const { statusCode: code } = response;
      if (!this.isWhiteListed(request)) {
        request.logger.info(`${text.completed} ${method} ${code} in ${delta}ms ${originalUrl} - ${userAgent} ${ip}`);
      }
    });

    if (!this.isWhiteListed(request)) {
      request.logger.info(`${text.started} ${method} ${originalUrl} - ${userAgent} ${ip}`);
      request.logger.info(`${text.payload} ${JSON.stringify(request.body)}`);
    }

    return next.handle();
  }

  private isWhiteListed(request: ExpressRequest) {
    const whiteListedPaths = ['health', 'metrics', 'docs', 'swagger-ui'];
    return whiteListedPaths.some((path) => request.url.includes(path));
  }
}
