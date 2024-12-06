import { MappingError } from '../error.ts';
import { createMapFn, createMapFnUndefined } from '../map.ts';
import { MapFn, MapFnCustomTransformer, MapFnUndefined } from '../types.ts';

type A = 'foo' | 'bar' | 'baz' | 'foobar' | 'barbaz';
type B = 'FOO' | 'BAR' | 'BAZ' | 'DEFAULT' | 'CUSTOM' | 'ANOTHER_CUSTOM';

describe('create map function', () => {
  const mapAB: Partial<Record<A, B>> = {
    foo: 'FOO',
    bar: 'BAR',
    baz: 'BAZ'
  };

  const customTransformer: MapFnCustomTransformer<A, B> = (input) => {
    return input === 'foobar' ? 'CUSTOM' : 'ANOTHER_CUSTOM';
  };

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
    expect(mapFn('foo', { customTransformer })).toBe('FOO');
    expect(mapFn('foobar', { customTransformer })).toBe('CUSTOM');
    expect(mapFn('barbaz', { customTransformer })).toBe('ANOTHER_CUSTOM');
    expect(mapFnCustom('foo')).toBe('FOO');
    expect(mapFnCustom('foobar')).toBe('CUSTOM');
    expect(mapFnCustom('barbaz')).toBe('ANOTHER_CUSTOM');
  }

  describe('core', () => {
    const mapFn = createMapFn<A, B>(mapAB);
    const mapFnDefault = createMapFn<A, B>(mapAB, { defaultValue: 'DEFAULT' });
    const mapFnErrorMessage = createMapFn<A, B>(mapAB, {
      errorMessage: (input: A) => `No output value for input "${input}"`
    });
    const mapFnCustom = createMapFn<A, B>(mapAB, { customTransformer });

    test('get existing value', () => {
      testExisting(mapFn);
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
    const mapFnDefault = createMapFnUndefined<A, B>(mapAB, { defaultValue: 'DEFAULT' });
    const mapFnCustom = createMapFn<A, B>(mapAB, { customTransformer });

    test('get existing value', () => {
      testExisting(mapFn);
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
