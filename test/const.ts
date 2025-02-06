import { MapFnCustomTransformer } from '../lib/types.ts';

import { A, B } from './types.ts';

export const mapAB: Partial<Record<A, B>> = { foo: 'FOO', bar: 'BAR', baz: 'BAZ' };
export const mapStrictAB: Record<A, B> = { foo: 'FOO', bar: 'BAR', baz: 'BAZ', foobar: 'FOO', barbaz: 'BAR' };

export const transformAtoB: MapFnCustomTransformer<A, B> = (input: A): B => {
  return input === 'foobar' ? 'CUSTOM' : 'ANOTHER_CUSTOM';
};

export const transformBtoA: MapFnCustomTransformer<B, A> = (input: B): A => {
  return input === 'CUSTOM' ? 'foobar' : 'foo';
};
