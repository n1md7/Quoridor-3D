import { vitest } from 'vitest';
import { delaySync, getErrorMessage, logger, removeCircularDependency, stringify, getPid } from './index';
import { AxiosError } from 'axios';
import { ValidationError } from 'class-validator';
import { exitProcess } from './index';
import { pid, exit } from 'node:process';
import { HttpException } from '@nestjs/common';

vitest.mock('node:process', () => ({
  exit: vitest.fn(),
  pid: 777,
}));

describe('utils', () => {
  describe.each`
    ttd
    ${8}
    ${32}
    ${64}
  `('delaySync( $ttd )', ({ ttd }) => {
    test(`should resolve after ${ttd} milliseconds delay`, () => {
      const start = Date.now();
      return delaySync(ttd).then(() => {
        // Add 10 extra since there is some kind of anomaly
        const end = Date.now() + 10;
        expect(end - start).toBeGreaterThanOrEqual(ttd);
      });
    });
  });

  describe('removeCircularDependency', () => {
    it('should remove circular dependency', () => {
      const a = { b: {} };
      const b = { a };
      a.b = b;

      const result = () => JSON.stringify(a, removeCircularDependency());

      expect(result).not.toThrow();
    });

    it('should not remove circular dependency', () => {
      const a = { b: {} };
      const result = () => JSON.stringify(a);

      expect(result).not.toThrow();
    });
  });

  describe.each([
    [new Error('message'), 'message'],
    ['message', 'message'],
    [null, 'null'],
    [undefined, 'undefined'],
    [1, '1'],
    [{}, '{}'],
    [[], '[]'],
    [
      {
        msg: 'test',
        props: {
          a: 1,
          b: {
            c: 2,
          },
        },
      },
      '{\n  "msg": "test",\n  "props": {\n    "a": 1,\n    "b": {\n      "c": 2\n    }\n  }\n}',
    ],
    [[1, 2, '3', { a: 1, b: 2 }], '[\n  1,\n  2,\n  "3",\n  {\n    "a": 1,\n    "b": 2\n  }\n]'],
    [
      Object.assign(new AxiosError('My Axios error', 'HTTP_NOT_FOUND'), {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      }),
      expect.stringContaining('My Axios error'),
    ],
    [
      Object.assign(
        new HttpException(
          {
            message: 'Error happened in the server',
          },
          500,
        ),
      ),
      expect.stringContaining('Error happened in the server'),
    ],
    [
      [
        Object.assign(new ValidationError(), {
          target: { a: 1, b: 2 },
          property: 'a',
          value: 'string-val',
          constraints: { isInt: 'a should be integer' },
        }),
      ],
      'a="string-val", a should be integer',
    ],
    [
      [
        Object.assign(new ValidationError(), {
          target: { a: 1, b: 2 },
          property: 'a',
          value: '',
          constraints: { isInt: 'a should be integer', isNotEmpty: 'a should not be empty' },
        }),
        Object.assign(new ValidationError(), {
          target: { b: 2 },
          property: 'b',
          value: '',
          constraints: { isNotEmpty: 'b should not be empty' },
        }),
      ],
      'a="", a should be integer, a should not be empty; b="", b should not be empty',
    ],
  ])('getErrorMessage( $error )', (error, expected) => {
    test(`should return ${expected}`, () => {
      const result = getErrorMessage(error);
      expect(result).toEqual(expected);
    });
  });

  describe('exitProcess', () => {
    it('should log and exit', () => {
      // Arrange
      const reason = 'Test reason';
      const fatal = vitest.spyOn(logger, 'fatal');

      // Act
      exitProcess(reason);

      // Assert
      expect(exit).toBeCalledWith(1);
      expect(fatal).toBeCalledWith(`Exiting due to an error: "${reason}"`);
    });
  });

  describe('stringify', () => {
    it('should stringify payload', () => {
      // Arrange
      const payload = { a: 1, b: '2' };

      // Act
      const result = stringify(payload);

      // Assert
      expect(result).toEqual('{\n  "a": 1,\n  "b": "2"\n}');
    });

    it('should stringify payload with circular dependency', () => {
      // Arrange
      const a = { b: {} };
      const b = { a };
      a.b = b;

      // Act
      const result = () => stringify(a);

      // Assert
      expect(result).not.toThrow();
    });
  });

  describe('getPid', () => {
    it('should return process id', () => {
      expect(getPid()).toEqual(pid);
    });
  });
});
