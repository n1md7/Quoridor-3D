import { Logger } from '@nestjs/common';
import { NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ExpressRequest } from '../types/request.type';

export function essentials(request: ExpressRequest, response: Response, next: NextFunction) {
  request.startedAt = Date.now();

  request.requestId = getRequestId(request);
  request.logger = new Logger(request.requestId);

  next();
}

function getRequestId(request: ExpressRequest) {
  return request.requestId || uuidv4();
}
