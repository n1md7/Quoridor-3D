import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    required: true,
    description: 'HTTP status code',
    examples: [400, 401, 403, 404, 422, 500],
  })
  statusCode!: number;

  @ApiProperty({
    required: true,
    description: 'HTTP status message',
    examples: ['Bad request', 'Unauthorized', 'Forbidden', 'Not found', 'Unprocessable Content', 'Internal Server Error'],
  })
  message!: string;
}
