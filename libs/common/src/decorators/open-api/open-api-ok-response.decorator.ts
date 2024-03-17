import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse as OriginalApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiOkResponse(type: any, isArray = false, options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiOkResponse({
      description: 'Returns SUCCESS when the request is successful.',
      type,
      isArray,
      ...options,
    }),
  );
}
