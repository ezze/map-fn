import { MapFn, MapFnOptions, MapFnUndefined, MapFnUndefinedOptions, MapKey } from './types.ts';
import { validateCreateMapFnResult, validateCreateMapFnUndefinedResult } from './utils.ts';

export function createMapFn<I extends MapKey, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnOptions<I, O>
): MapFn<I, O> {
  return (input: I, mapOptions?: MapFnOptions<I, O>): O => {
    const output: O | undefined = map[input];
    return validateCreateMapFnResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnStrict<I extends MapKey, O>(map: Record<I, O>): MapFn<I, O> {
  return createMapFn<I, O>(map);
}

export function createMapFnUndefined<I extends MapKey, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnUndefinedOptions<I, O>
): MapFnUndefined<I, O> {
  return (input: I, mapOptions?: MapFnUndefinedOptions<I, O>): O | undefined => {
    const output: O | undefined = map[input];
    return validateCreateMapFnUndefinedResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnStrictUndefined<I extends MapKey, O>(map: Record<I, O>): MapFnUndefined<I, O> {
  return createMapFnUndefined<I, O>(map);
}
