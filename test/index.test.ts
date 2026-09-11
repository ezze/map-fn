import {
  createArgumentMapFn,
  createArgumentMapFnStrict,
  createArgumentMapFnStrictUndefined,
  createArgumentMapFnUndefined,
  createMapFn,
  createMapFnStrict,
  createMapFnStrictUndefined,
  createMapFnUndefined,
  createReverseMapFn,
  createReverseMapFnStrict,
  createReverseMapFnStrictUndefined,
  createReverseMapFnUndefined,
  MappingError
} from '../lib';

import { mapAB, mapStrictAB } from './const.ts';
import { A, B } from './types.ts';

describe('public exports', () => {
  test('direct mapping function creators', () => {
    expect(createMapFn<A, B>(mapAB)('foo')).toBe('FOO');
    expect(createMapFnStrict<A, B>(mapStrictAB)('foo')).toBe('FOO');
    expect(createMapFnUndefined<A, B>(mapAB)('foo')).toBe('FOO');
    expect(createMapFnStrictUndefined<A, B>(mapStrictAB)('foo')).toBe('FOO');
  });

  test('reverse mapping function creators', () => {
    expect(createReverseMapFn<A, B>(mapAB)('FOO')).toBe('foo');
    expect(createReverseMapFnStrict<A, B>(mapStrictAB)('FOO')).toBe('foobar');
    expect(createReverseMapFnUndefined<A, B>(mapAB)('FOO')).toBe('foo');
    expect(createReverseMapFnStrictUndefined<A, B>(mapStrictAB)('FOO')).toBe('foobar');
  });

  test('mapping function creators with argument', () => {
    const mapWithArgument: Partial<Record<A, (number: number) => B>> = { foo: () => 'FOO' };
    const mapWithArgumentStrict: Record<A, (number: number) => B> = {
      foo: () => 'FOO',
      bar: () => 'BAR',
      baz: () => 'BAZ',
      foobar: () => 'FOO',
      barbaz: () => 'BAR'
    };

    expect(createArgumentMapFn<A, B, number>(mapWithArgument)('foo', 1)).toBe('FOO');
    expect(createArgumentMapFnStrict<A, B, number>(mapWithArgumentStrict)('foo', 1)).toBe('FOO');
    expect(createArgumentMapFnUndefined<A, B, number>(mapWithArgument)('foo', 1)).toBe('FOO');
    expect(createArgumentMapFnStrictUndefined<A, B, number>(mapWithArgumentStrict)('foo', 1)).toBe('FOO');
  });

  test('mapping error', () => {
    expect(new MappingError('foobar')).toBeInstanceOf(Error);
  });
});
