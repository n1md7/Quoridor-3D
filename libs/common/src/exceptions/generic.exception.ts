import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';

export class Exception extends HttpException {
  constructor(response: string | Record<string, any>, status: HttpStatus, options?: HttpExceptionOptions) {
    super(response, status, options);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
