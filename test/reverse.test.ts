import { MappingError } from '../lib/error.ts';
import {
  createReverseMapFn,
  createReverseMapFnStrict,
  createReverseMapFnStrictUndefined,
  createReverseMapFnUndefined
} from '../lib/reverse.ts';
import { ReverseMapFn, ReverseMapFnUndefined } from '../lib/types.ts';

import { mapAB, mapStrictAB, transformBtoA } from './const.ts';
import { A, B } from './types.ts';

describe('create reverse map function', () => {
  function testExisting(mapFn: ReverseMapFn<A, B> | ReverseMapFnUndefined<A, B>, alternative = false): void {
    expect(mapFn('FOO')).toBe(alternative ? 'foobar' : 'foo');
    expect(mapFn('BAR')).toBe(alternative ? 'barbaz' : 'bar');
    expect(mapFn('BAZ')).toBe('baz');
  }

  function testDefault(
    mapFn: ReverseMapFn<A, B> | ReverseMapFnUndefined<A, B>,
    mapFnDefault: ReverseMapFn<A, B> | ReverseMapFnUndefined<A, B>
  ): void {
    expect(mapFn('CUSTOM', { defaultValue: 'foo' })).toBe('foo');
    expect(mapFnDefault('CUSTOM')).toBe('foo');
    expect(mapFnDefault('CUSTOM', { defaultValue: 'bar' })).toBe('bar');
  }

  function testCustomTransformation(
    mapFn: ReverseMapFn<A, B> | ReverseMapFnUndefined<A, B>,
    mapFnCustom: ReverseMapFn<A, B> | ReverseMapFnUndefined<A, B>
  ): void {
    expect(mapFn('BAR', { customTransformer: transformBtoA })).toBe('bar');
    expect(mapFn('CUSTOM', { customTransformer: transformBtoA })).toBe('foobar');
    expect(mapFn('ANOTHER_CUSTOM', { customTransformer: transformBtoA })).toBe('foo');
    expect(mapFnCustom('BAR')).toBe('bar');
    expect(mapFnCustom('CUSTOM')).toBe('foobar');
    expect(mapFnCustom('ANOTHER_CUSTOM')).toBe('foo');
  }

  describe('core', () => {
    const mapFn = createReverseMapFn<A, B>(mapAB);
    const mapFnStrict = createReverseMapFnStrict<A, B>(mapStrictAB);
    const mapFnDefault = createReverseMapFn<A, B>(mapAB, { defaultValue: 'foo' });
    const mapFnErrorMessage = createReverseMapFn<A, B>(mapAB, {
      errorMessage: (input: B): string => `No output value for input "${input}"`
    });
    const mapFnCustom = createReverseMapFn<A, B>(mapAB, { customTransformer: transformBtoA });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict, true);
      testExisting(mapFnDefault);
      testExisting(mapFnErrorMessage);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test('throw on non-existing value', () => {
      expect(() => mapFn('CUSTOM')).toThrow(new MappingError('Unable to map "CUSTOM", default value is not provided'));
      expect(() => {
        mapFn('CUSTOM', { errorMessage: (input: B): string => `Output is not found for "${input}"` });
      }).toThrow('Output is not found for "CUSTOM"');
      expect(() => mapFnErrorMessage('CUSTOM')).toThrow(new MappingError('No output value for input "CUSTOM"'));
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);
    });
  });

  describe('undefined as default', () => {
    const mapFn = createReverseMapFnUndefined<A, B>(mapAB);
    const mapFnStrict = createReverseMapFnStrictUndefined<A, B>(mapStrictAB);
    const mapFnDefault = createReverseMapFnUndefined<A, B>(mapAB, { defaultValue: 'foo' });
    const mapFnCustom = createReverseMapFn<A, B>(mapAB, { customTransformer: transformBtoA });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict, true);
      testExisting(mapFnDefault);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test("don't throw on non-existing value", () => {
      expect(mapFn('DEFAULT')).toBe(undefined);
      expect(mapFn('CUSTOM')).toBe(undefined);
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);
    });
  });
});
