import { ExpressRequest } from '/common/types/request.type';
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export type Ctx = {
  requestId: string;
  sessionId: string;
  logger: Logger;
};
export const Ctx = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequest>();

  return {
    requestId: request.requestId,
    sessionId: request.sessionId,
    logger: request.logger,
  };
});
