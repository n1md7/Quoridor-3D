import { NodeEnv } from '/common/types/node-env.type';
import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(NodeEnv.TEST, NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.E2E)
    .label('Node environment')
    .default(NodeEnv.DEVELOPMENT)
    .optional(),

  PORT: Joi.number().positive().less(65536).label('Server port number').optional().default(3000),

  ORIGIN: Joi.string()
    .optional()
    .allow('')
    .default('')
    .label('Allowed Origins')
    .description('Comma separated origin string list')
    .example('http://localhost:4200'),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
