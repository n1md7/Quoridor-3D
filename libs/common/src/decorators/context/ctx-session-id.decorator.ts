import { ExpressRequest } from '/common/types/request.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CtxSesId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<ExpressRequest>().sessionId;
});
