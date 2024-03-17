import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse as OriginalApiBadRequestResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiBadRequestResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiBadRequestResponse({
      description: 'Returns BAD_REQUEST when the payload is invalid or malformed.',
      schema: {
        type: 'object',
        example: {
          statusCode: 400,
          message: ['name should not be empty', 'name should be string'],
          error: 'Bad Request',
        },
        properties: {
          message: { type: 'array' },
          statusCode: { type: 'number' },
          error: { type: 'string' },
        },
      },
      ...options,
    }),
  );
}
