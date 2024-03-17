import { ExpressRequest } from '/common/types/request.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpLogger } from 'pino-http';

export type Ctx = {
  requestId: string;
  sessionId: string;
} & HttpLogger;
export const Ctx = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequest>();

  return {
    requestId: request.requestId,
    sessionId: request.sessionId,
    logger: request.logger,
  };
});
