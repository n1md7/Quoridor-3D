import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse as OriginalApiCreatedResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiCreatedResponse(type: any, options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiCreatedResponse({
      description: 'Returns CREATED when the resource successfully created.',
      type,
      ...options,
    }),
  );
}
