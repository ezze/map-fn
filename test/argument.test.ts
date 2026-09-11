import { MappingError } from '../lib';
import {
  createArgumentMapFn,
  createArgumentMapFnStrict,
  createArgumentMapFnStrictUndefined,
  createArgumentMapFnUndefined
} from '../lib/argument.ts';
import {
  ArgumentMapFn,
  ArgumentMapFnCustomTransformer,
  ArgumentMapFnDefaultValueFn,
  ArgumentMapFnUndefined
} from '../lib/types';

import { A, B } from './types';

describe('create map function with argument', () => {
  const mapCommonAB: Record<'foo' | 'bar' | 'baz', (number: number) => B> = {
    foo: (id) => (id <= 3 ? 'FOO' : 'BAR'),
    bar: (id) => (id <= 5 ? 'BAR' : 'BAZ'),
    baz: (id) => (id <= 7 ? 'BAZ' : 'FOO')
  };

  const mapAB: Partial<Record<A, (number: number) => B>> = { ...mapCommonAB };

  const mapStrictAB: Record<A, (number: number) => B> = {
    ...mapCommonAB,
    foobar: () => 'FOO',
    barbaz: () => 'BAR'
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

  function testExisting(mapFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>): void {
    expect(mapFn('foo', 3)).toBe('FOO');
    expect(mapFn('foo', 5)).toBe('BAR');
    expect(mapFn('bar', 5)).toBe('BAR');
    expect(mapFn('bar', 7)).toBe('BAZ');
    expect(mapFn('baz', 7)).toBe('BAZ');
    expect(mapFn('baz', 9)).toBe('FOO');
  }

  function testDefault(
    mapFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>,
    mapFnDefault: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>
  ): void {
    expect(mapFn('foobar', 3, { defaultValue: 'CUSTOM' })).toBe('CUSTOM');
    expect(mapFn('barbaz', 3, { defaultValue: 'ANOTHER_CUSTOM' })).toBe('ANOTHER_CUSTOM');
    expect(mapFnDefault('foobar', 3)).toBe('CUSTOM');
    expect(mapFnDefault('barbaz', 3)).toBe('CUSTOM');
    expect(mapFnDefault('foobar', 3, { defaultValue: 'ANOTHER_CUSTOM' })).toBe('ANOTHER_CUSTOM');
  }

  function testDefaultFn(
    mapFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>,
    mapFnDefaultFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>,
    mapFnDefaultArgumentFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>
  ): void {
    expect(mapFn('foobar', 3, { defaultValue: () => 'DEFAULT' })).toBe('DEFAULT');
    expect(mapFn('foobar', 3, { defaultValue })).toBe('BAR');
    expect(mapFn('foobar', 5, { defaultValue })).toBe('FOO');
    expect(mapFn('barbaz', 3, { defaultValue })).toBe('CUSTOM');
    expect(mapFn('barbaz', 5, { defaultValue })).toBe('CUSTOM');
    expect(mapFnDefaultFn('foobar', 3)).toBe('DEFAULT');
    expect(mapFnDefaultFn('foobar', 3, { defaultValue: () => 'CUSTOM' })).toBe('CUSTOM');
    expect(mapFnDefaultFn('foobar', 3, { defaultValue })).toBe('BAR');
    expect(mapFnDefaultFn('foobar', 5, { defaultValue })).toBe('FOO');
    expect(mapFnDefaultFn('barbaz', 3, { defaultValue })).toBe('CUSTOM');
    expect(mapFnDefaultFn('barbaz', 5, { defaultValue })).toBe('CUSTOM');
    expect(mapFnDefaultFn('foobar', 3, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefaultFn('foobar', 5, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefaultFn('barbaz', 3, { defaultValue: alternativeDefaultValue })).toBe('CUSTOM');
    expect(mapFnDefaultFn('barbaz', 5, { defaultValue: alternativeDefaultValue })).toBe('ANOTHER_CUSTOM');
    expect(mapFnDefaultArgumentFn('foobar', 3)).toBe('BAR');
    expect(mapFnDefaultArgumentFn('foobar', 5)).toBe('FOO');
    expect(mapFnDefaultArgumentFn('barbaz', 3)).toBe('CUSTOM');
    expect(mapFnDefaultArgumentFn('barbaz', 5)).toBe('CUSTOM');
    expect(mapFnDefaultArgumentFn('foobar', 3, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefaultArgumentFn('foobar', 5, { defaultValue: alternativeDefaultValue })).toBe('DEFAULT');
    expect(mapFnDefaultArgumentFn('barbaz', 3, { defaultValue: alternativeDefaultValue })).toBe('CUSTOM');
    expect(mapFnDefaultArgumentFn('barbaz', 5, { defaultValue: alternativeDefaultValue })).toBe('ANOTHER_CUSTOM');
  }

  function testCustomTransformation(
    mapFn: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>,
    mapFnCustom: ArgumentMapFn<A, B, number> | ArgumentMapFnUndefined<A, B, number>
  ): void {
    expect(mapFn('foobar', 3, { customTransformer })).toBe('FOO');
    expect(mapFnCustom('foobar', 3)).toBe('FOO');
    expect(mapFn('barbaz', 3, { customTransformer })).toBe('BAR');
    expect(mapFnCustom('barbaz', 3)).toBe('BAR');
  }

  describe('basic', () => {
    const mapFn = createArgumentMapFn<A, B, number>(mapAB);
    const mapFnStrict = createArgumentMapFnStrict<A, B, number>(mapStrictAB);
    const mapFnDefault = createArgumentMapFn<A, B, number>(mapAB, { defaultValue: 'CUSTOM' });
    const mapFnDefaultFn = createArgumentMapFn<A, B, number>(mapAB, { defaultValue: () => 'DEFAULT' });
    const mapFnDefaultArgumentFn = createArgumentMapFn<A, B, number>(mapAB, { defaultValue });
    const mapFnErrorMessage = createArgumentMapFn<A, B, number>(mapAB, {
      errorMessage: (input: A, argument: number): string =>
        `No output value for input "${input}" and argument "${argument}"`
    });
    const mapFnCustom = createArgumentMapFn<A, B, number>(mapAB, { customTransformer });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict);
      testExisting(mapFnDefault);
      testExisting(mapFnDefaultFn);
      testExisting(mapFnDefaultArgumentFn);
      testExisting(mapFnErrorMessage);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test('provide default value function', () => {
      testDefaultFn(mapFn, mapFnDefaultFn, mapFnDefaultArgumentFn);
    });

    test('throw on non-existing value', () => {
      expect(() => mapFn('foobar', 3)).toThrow(
        new MappingError('Unable to map "foobar" with argument "3", default value is not provided')
      );
      expect(() =>
        mapFn('foobar', 3, {
          errorMessage: (input: A, argument: number) => `Output is not found for "${input}" with argument "${argument}"`
        })
      ).toThrow('Output is not found for "foobar" with argument "3"');
      expect(() => mapFnErrorMessage('foobar', 3)).toThrow(
        new MappingError('No output value for input "foobar" and argument "3"')
      );
    });

    test('default error message with object argument', () => {
      const mapFnObjectArgument = createArgumentMapFn<A, B, { id: number }>({});
      expect(() => mapFnObjectArgument('foobar', { id: 1 })).toThrow(
        new MappingError('Unable to map "foobar" with argument "[object Object]", default value is not provided')
      );
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);

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

      expect(() => mapFn('barbaz', 5, { customTransformer })).toThrow(
        new MappingError('Unable to map "barbaz" with argument "5", default value is not provided')
      );
      expect(() => mapFnCustom('barbaz', 5)).toThrow(
        new MappingError('Unable to map "barbaz" with argument "5", default value is not provided')
      );
    });
  });

  describe('undefined as default', () => {
    const mapFn = createArgumentMapFnUndefined<A, B, number>(mapAB);
    const mapFnStrict = createArgumentMapFnStrictUndefined<A, B, number>(mapStrictAB);
    const mapFnDefault = createArgumentMapFnUndefined<A, B, number>(mapAB, { defaultValue: 'CUSTOM' });
    const mapFnDefaultFn = createArgumentMapFnUndefined<A, B, number>(mapAB, { defaultValue: () => 'DEFAULT' });
    const mapFnDefaultArgumentFn = createArgumentMapFnUndefined<A, B, number>(mapAB, { defaultValue });
    const mapFnCustom = createArgumentMapFn<A, B, number>(mapAB, { customTransformer });

    test('get existing value', () => {
      testExisting(mapFn);
      testExisting(mapFnStrict);
      testExisting(mapFnDefault);
      testExisting(mapFnDefaultFn);
      testExisting(mapFnDefaultArgumentFn);
      testExisting(mapFnCustom);
    });

    test('provide default value', () => {
      testDefault(mapFn, mapFnDefault);
    });

    test('provide default value function', () => {
      testDefaultFn(mapFn, mapFnDefaultFn, mapFnDefaultArgumentFn);
    });

    test("don't throw on non-existing value", () => {
      expect(mapFn('foobar', 3)).toBe(undefined);
      expect(mapFn('barbaz', 3)).toBe(undefined);
    });

    test('custom transformation', () => {
      testCustomTransformation(mapFn, mapFnCustom);
    });
  });
});
