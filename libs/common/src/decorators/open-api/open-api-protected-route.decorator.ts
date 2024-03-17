import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiProtected(tag: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Returns UNAUTHORIZED when JWT is not provided, invalid or expired.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Returns FORBIDDEN when JWT is valid but user is not authorized.',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden',
        },
      },
    }),
    ApiTags(tag),
  );
}
