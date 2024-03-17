import { NodeEnv } from '/common/enums/env.enum';

export class Env {
  public static get NodeEnv(): NodeEnv {
    const env = (process.env.NODE_ENV || '').trim() as NodeEnv;
    if (!env) throw new TypeError('NODE_ENV is not defined');

    return env;
  }

  public static get isDev() {
    return Env.NodeEnv === NodeEnv.DEVELOPMENT;
  }

  public static get isProd() {
    return Env.NodeEnv === NodeEnv.PRODUCTION;
  }

  public static get isTest() {
    return Env.NodeEnv === NodeEnv.TEST;
  }

  public static get isE2E() {
    return process.env.E2E === NodeEnv.E2E;
  }
}
