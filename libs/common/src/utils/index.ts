import { exit, pid } from 'node:process';
import { ValidationError } from 'class-validator';
import { AxiosError } from 'axios';
import { HttpException, Logger } from '@nestjs/common';

export const logger = new Logger('Shared');

export async function delaySync(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), ms);
  });
}

export function removeCircularDependency() {
  const hash = new Set();

  return (key: string, value: any) => {
    if (isObject(value)) {
      if (hash.has(value)) return;
      hash.add(value);
    }
    return value;
  };
}

function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

function unknownErrorStrategy(error: unknown) {
  if (error === null) return 'null';
  if (error === undefined) return 'undefined';
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'number') return error.toString();

  return stringify(error);
}

function classValidatorErrorStrategy(error: ValidationError[]) {
  return error
    .map((e) => ({
      property: e.property,
      value: e.value,
      constraints: Object.values(e.constraints || {}).join(', '),
    }))
    .map((e) => `${e.property}="${e.value}", ${e.constraints}`)
    .join('; ');
}

function axiosErrorStrategy(error: AxiosError) {
  return `${error.message} - ${error.response?.status} - ${stringify(error.response?.data)}`;
}

function httpErrorStrategy(error: HttpException) {
  const messages = [];
  const response = error.getResponse();
  if (isString(response)) messages.push(response);
  else if (isObject(response) && response.hasOwnProperty('message')) {
    messages.push((response as any)['message']);
  } else messages.push(response);

  return `${error.message} - [${messages.join(', ')}]`;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) return axiosErrorStrategy(error);
  if (error instanceof HttpException) return httpErrorStrategy(error);
  if (Array.isArray(error)) {
    if (error[0] instanceof ValidationError) {
      return classValidatorErrorStrategy(error);
    }
  }

  return unknownErrorStrategy(error);
}

export function exitProcess(reason?: unknown) {
  const message = getErrorMessage(reason);
  logger.fatal(`Exiting due to an error: "${message}"`);
  exit(1);
}

export function stringify(payload: unknown): string {
  if (isObject(payload)) payload = JSON.stringify(payload, removeCircularDependency(), 2);

  return String(payload); // Any other primitive types
}

export function getPid() {
  return pid;
}
