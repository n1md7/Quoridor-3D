import { RequestHeader } from '/common/enums/request.enum';
import { NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ExpressRequest } from '../types/request.type';

export function essentials(request: ExpressRequest, response: Response, next: NextFunction) {
  injectRequestId(request); // Only when it's not present

  request.startedAt = Date.now();

  next();
}

function injectRequestId(request: ExpressRequest) {
  request.requestId = request.headers[RequestHeader.RequestId] as string;
  if (!request.requestId) {
    request.requestId = uuidv4();
  }
}
