import { MappingError } from '../lib/error.ts';
import { createMapFn, createMapFnStrict, createMapFnStrictUndefined, createMapFnUndefined } from '../lib/map.ts';
import { MapFn, MapFnUndefined } from '../lib/types.ts';

import { transformAtoB, mapAB, mapStrictAB } from './const.ts';
import { A, B } from './types.ts';

describe('create map function', () => {
  function testExisting(mapFn: MapFn<A, B> | MapFnUndefined<A, B>): void {
    expect(mapFn('foo')).toBe('FOO');
    expect(mapFn('bar')).toBe('BAR');
    expect(mapFn('baz')).toBe('BAZ');
  }

  function testDefault(
    mapFn: MapFn<A, B> | MapFnUndefined<A, B>,
    mapFnDefault: MapFn<A, B> | MapFnUndefined<A, B>
  ): void {
    expect(mapFn('foobar', { defaultValue: 'DEFAULT' })).toBe('DEFAULT');
    expect(mapFnDefault('foobar')).toBe('DEFAULT');
    expect(mapFnDefault('foobar', { defaultValue: 'CUSTOM' })).toBe('CUSTOM');
  }

  function testCustomTransformation(
    mapFn: MapFn<A, B> | MapFnUndefined<A, B>,
    mapFnCustom: MapFn<A, B> | MapFnUndefined<A, B>
  ): void {
    expect(mapFn('foo', { customTransformer: transformAtoB })).toBe('FOO');
    expect(mapFn('foobar', { customTransformer: transformAtoB })).toBe('CUSTOM');
    expect(mapFn('barbaz', { customTransformer: transformAtoB })).toBe('ANOTHER_CUSTOM');
    expect(mapFnCustom('foo')).toBe('FOO');
    expect(mapFnCustom('foobar')).toBe('CUSTOM');
    expect(mapFnCustom('barbaz')).toBe('ANOTHER_CUSTOM');
  }

  describe('core', () => {
    const mapFn = createMapFn<A, B>(mapAB);
    const mapFnStrict = createMapFnStrict<A, B>(mapStrictAB);
    const mapFnDefault = createMapFn<A, B>(mapAB, { defaultValue: 'DEFAULT' });
    const mapFnErrorMessage = createMapFn<A, B>(mapAB, {
      errorMessage: (input: A): string => `No output value for input "${input}"`
    });
    const mapFnCustom = createMapFn<A, B>(mapAB, { customTransformer: transformAtoB });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict);
      testExisting(mapFnDefault);
      testExisting(mapFnErrorMessage);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test('throw on non-existing value', () => {
      expect(() => mapFn('foobar')).toThrow(new MappingError('Unable to map "foobar", default value is not provided'));
      expect(() => mapFn('foobar', { errorMessage: (input: A) => `Output is not found for "${input}"` })).toThrow(
        'Output is not found for "foobar"'
      );
      expect(() => mapFnErrorMessage('foobar')).toThrow(new MappingError('No output value for input "foobar"'));
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);
    });
  });

  describe('undefined as default', () => {
    const mapFn = createMapFnUndefined<A, B>(mapAB);
    const mapFnStrict = createMapFnStrictUndefined<A, B>(mapStrictAB);
    const mapFnDefault = createMapFnUndefined<A, B>(mapAB, { defaultValue: 'DEFAULT' });
    const mapFnCustom = createMapFn<A, B>(mapAB, { customTransformer: transformAtoB });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict);
      testExisting(mapFnDefault);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test("don't throw on non-existing value", () => {
      expect(mapFn('foobar')).toBe(undefined);
      expect(mapFn('barbaz')).toBe(undefined);
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);
    });
  });
});
