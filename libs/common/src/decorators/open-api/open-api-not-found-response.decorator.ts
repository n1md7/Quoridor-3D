import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse as OriginalApiNotFoundResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiNotFoundResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiNotFoundResponse({
      description: 'Returns NOT_FOUND when the requested resource is not found.',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
          message: {
            type: 'string',
            example: 'The resource with #7 is not available',
          },
        },
      },
      ...options,
    }),
  );
}
