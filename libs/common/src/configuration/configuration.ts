import { env } from 'node:process';

export const Configuration = () => ({
  http: {
    origin: env.ORIGIN,
    port: parseInt(env.PORT!, 10),
  },
});
export type ConfigurationType = ReturnType<typeof Configuration>;
