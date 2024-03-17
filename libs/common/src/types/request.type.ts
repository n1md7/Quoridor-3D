import { Request } from 'express';
import { Logger } from '@nestjs/common';

export interface ExpressRequest extends Request {
  startedAt: number;
  requestId: string;
  sessionId: string;
  logger: Logger;
}
