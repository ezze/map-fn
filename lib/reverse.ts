import { createMapFn, createMapFnUndefined } from './map.ts';
import {
  MapKey,
  ReverseMapFn,
  ReverseMapFnOptions,
  ReverseMapFnUndefined,
  ReverseMapFnUndefinedOptions
} from './types.ts';

const numericRegExp = /^\d+$/;

function reverseMap<I extends MapKey, O extends MapKey>(map: Partial<Record<I, O>>): Partial<Record<O, I>> {
  const reverseMap: Partial<Record<O, I>> = {};
  Object.entries(map).forEach((entry) => {
    const [key, value] = entry;
    reverseMap[value as O] = (numericRegExp.test(key) ? Number(key) : key) as I;
  });
  return reverseMap;
}

export function createReverseMapFn<I extends MapKey, O extends MapKey>(
  map: Partial<Record<I, O>>,
  mapOptions?: ReverseMapFnOptions<I, O>
): ReverseMapFn<I, O> {
  return createMapFn<O, I>(reverseMap<I, O>(map), mapOptions);
}

export function createReverseMapFnStrict<I extends MapKey, O extends MapKey>(map: Record<I, O>): ReverseMapFn<I, O> {
  return createReverseMapFn<I, O>(map);
}

export function createReverseMapFnUndefined<I extends MapKey, O extends MapKey>(
  map: Partial<Record<I, O>>,
  mapOptions?: ReverseMapFnUndefinedOptions<I, O>
): ReverseMapFnUndefined<I, O> {
  return createMapFnUndefined<O, I>(reverseMap<I, O>(map), mapOptions);
}

export function createReverseMapFnStrictUndefined<I extends MapKey, O extends MapKey>(
  map: Record<I, O>
): ReverseMapFnUndefined<I, O> {
  return createReverseMapFnUndefined<I, O>(map);
}
