import { MapFn, MapFnInput, MapFnOptions, MapFnUndefined, MapFnUndefinedOptions } from './types.ts';
import { validateCreateMapFnResult, validateCreateMapFnUndefinedResult } from './utils.ts';

export function createMapFn<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnOptions<I, O>
): MapFn<I, O> {
  return (input: I, mapOptions?: MapFnOptions<I, O>): O => {
    const output: O | undefined = map[input];
    return validateCreateMapFnResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnUndefined<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnUndefinedOptions<I, O>
): MapFnUndefined<I, O> {
  return (input: I, mapOptions?: MapFnUndefinedOptions<I, O>): O | undefined => {
    const output: O | undefined = map[input];
    return validateCreateMapFnUndefinedResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}
