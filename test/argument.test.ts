import { MappingError } from '../lib';
import { createArgumentMapFn } from '../lib/argument.ts';
import { ArgumentMapFnCustomTransformer, ArgumentMapFnDefaultValueFn } from '../lib/types';

import { A, B } from './types';

describe('create map function with argument', () => {
  const mapAB: Partial<Record<A, (number: number) => B>> = {
    foo: (id) => (id <= 3 ? 'FOO' : 'BAR'),
    bar: (id) => (id <= 5 ? 'BAR' : 'BAZ'),
    baz: (id) => (id <= 7 ? 'BAZ' : 'FOO')
  };

  const defaultValue: ArgumentMapFnDefaultValueFn<A, B, number> = (input: A, number: number): B => {
    if (input === 'foobar') {
      return number >= 5 ? 'FOO' : 'BAR';
    }
    return 'CUSTOM';
  };

  const alternativeDefaultValue: ArgumentMapFnDefaultValueFn<A, B, number> = (input: A, number: number): B => {
    if (input === 'barbaz') {
      return number >= 4 ? 'ANOTHER_CUSTOM' : 'CUSTOM';
    }
    return 'DEFAULT';
  };

  const customTransformer: ArgumentMapFnCustomTransformer<A, B, number> = (input: A, number: number): B | undefined => {
    if (number >= 4) {
      return undefined;
    }
    return input === 'foobar' ? 'FOO' : 'BAR';
  };

  test('get existing value', () => {
    const mapFn = createArgumentMapFn<A, B, number>(mapAB);
    expect(mapFn('foo', 3)).toBe('FOO');
    expect(mapFn('foo', 5)).toBe('BAR');
    expect(mapFn('bar', 5)).toBe('BAR');
    expect(mapFn('bar', 7)).toBe('BAZ');
    expect(mapFn('baz', 7)).toBe('BAZ');
    expect(mapFn('baz', 9)).toBe('FOO');
  });

  test('default value', () => {
    const mapFn = createArgumentMapFn<A, B, number>(mapAB);
    const mapFnDefault = createArgumentMapFn<A, B, number>(mapAB, { defaultValue: 'CUSTOM' });
    expect(mapFn('foobar', 3, { defaultValue: 'CUSTOM' })).toBe('CUSTOM');
    expect(mapFn('barbaz', 3, { defaultValue: 'ANOTHER_CUSTOM' })).toBe('ANOTHER_CUSTOM');
    expect(mapFnDefault('foobar', 3)).toBe('CUSTOM');
    expect(mapFnDefault('barbaz', 3)).toBe('CUSTOM');
    expect(mapFnDefault('foobar', 3, { defaultValue: 'ANOTHER_CUSTOM' })).toBe('ANOTHER_CUSTOM');
  });

  test('default value function', () => {
    const mapFn = createArgumentMapFn<A, B, number>(mapAB);
    const mapFnDefault = createArgumentMapFn<A, B, number>(mapAB, { defaultValue });
    expect(mapFn('foobar', 3, { defaultValue })).toBe('BAR');
    expect(mapFn('foobar', 5, { defaultValue })).toBe('FOO');
    expect(mapFn('barbaz', 3, { defaultValue })).toBe('CUSTOM');
    expect(mapFn('barbaz', 5, { defaultValue })).toBe('CUSTOM');
    expect(mapFnDefault('foobar', 3)).toBe('BAR');
    expect(mapFnDefault('foobar', 5)).toBe('FOO');
    expect(mapFnDefault('barbaz', 3)).toBe('CUSTOM');
    expect(mapFnDefault('barbaz', 5)).toBe('CUSTOM');
    expect(mapFnDefault('foobar', 3, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefault('foobar', 5, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefault('barbaz', 3, { defaultValue: alternativeDefaultValue })).toBe('CUSTOM');
    expect(mapFnDefault('barbaz', 5, { defaultValue: alternativeDefaultValue })).toBe('ANOTHER_CUSTOM');
  });

  test('custom transformation', () => {
    const mapFn = createArgumentMapFn<A, B, number>(mapAB);
    const mapFnCustom = createArgumentMapFn<A, B, number>(mapAB, { customTransformer });

    expect(mapFn('foobar', 3, { customTransformer })).toBe('FOO');
    expect(mapFnCustom('foobar', 3)).toBe('FOO');

    expect(() => mapFn('foobar', 5, { customTransformer })).toThrow(
      new MappingError('Unable to map "foobar" with argument "5", default value is not provided')
    );
    expect(() => mapFnCustom('foobar', 5)).toThrow(
      new MappingError('Unable to map "foobar" with argument "5", default value is not provided')
    );

    expect(mapFn('foobar', 5, { customTransformer, defaultValue })).toBe('FOO');
    expect(mapFnCustom('foobar', 5, { defaultValue })).toBe('FOO');

    expect(mapFn('foobar', 5, { customTransformer, defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnCustom('foobar', 5, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');

    expect(mapFn('barbaz', 3, { customTransformer })).toBe('BAR');
    expect(mapFnCustom('barbaz', 3)).toBe('BAR');

    expect(() => mapFn('barbaz', 5, { customTransformer })).toThrow(
      new MappingError('Unable to map "barbaz" with argument "5", default value is not provided')
    );
    expect(() => mapFnCustom('barbaz', 5)).toThrow(
      new MappingError('Unable to map "barbaz" with argument "5", default value is not provided')
    );
  });
});
