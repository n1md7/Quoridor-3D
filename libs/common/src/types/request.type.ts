import { Request } from 'express';
import { HttpLogger } from 'pino-http';

export interface ExpressRequest extends Request, HttpLogger {
  startedAt: number;
  requestId: string;
  sessionId: string;
}
