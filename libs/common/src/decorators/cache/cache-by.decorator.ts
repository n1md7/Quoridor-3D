import ms from 'ms';
import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 5 * 60, // 5 minutes
  checkperiod: 60, // 1 minute
});

type ExpiresIn = `${number}${string}`;
type Params = {
  TTL?: ExpiresIn;
  key?: string;
};
type ReturnType = (target: any, methodName: string, descriptor: PropertyDescriptor) => void;

/**
 * Cache the result of a method by its key.
 *
 * Key is ClassName.methodName by default unless specified.
 *
 * TTL is set to 5 minutes by default unless specified
 */
export function cached(expiresIn: ExpiresIn): ReturnType;
export function cached(key: string): ReturnType;
export function cached(params: Params): ReturnType;
export function cached(args: unknown) {
  const params = extractParams(args);
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const key = params.key || `${target.constructor.name}.${methodName}`;
      if (cache.has(key)) return cache.get(key);

      const result = await originalMethod.apply(this, args);
      cache.set(key, result, ms(params.TTL || '5m') / 1000);
      return result;
    };
  };
}

function extractParams(params: unknown) {
  if (typeof params === 'string') {
    if (!params.match(/^\d+[smhdw]$/)) return { key: params };
    return { TTL: params as ExpiresIn };
  }

  return params as Params;
}
