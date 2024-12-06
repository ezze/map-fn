import { createMapFnWithOptions } from '../options.ts';

describe('create map function with options', () => {
  type A = 'foo' | 'bar' | 'baz' | 'foobar' | 'barbaz';
  type B = 'FOO' | 'BAR' | 'BAZ' | 'DEFAULT' | 'CUSTOM' | 'ANOTHER_CUSTOM';

  const mapAB: Partial<Record<A, (number: number) => B>> = {
    foo: (id) => (id <= 3 ? 'FOO' : 'BAR'),
    bar: (id) => (id <= 5 ? 'BAR' : 'BAZ'),
    baz: (id) => (id <= 7 ? 'BAZ' : 'FOO')
  };

  test('get existing value', () => {
    const mapFn = createMapFnWithOptions<A, B, number>(mapAB);
    expect(mapFn('foo', 3)).toBe('FOO');
    expect(mapFn('foo', 5)).toBe('BAR');
    expect(mapFn('bar', 5)).toBe('BAR');
    expect(mapFn('bar', 7)).toBe('BAZ');
    expect(mapFn('baz', 7)).toBe('BAZ');
    expect(mapFn('baz', 9)).toBe('FOO');
  });
});
