import {
  MapFnInput,
  MapFnOptions,
  MapFnUndefinedOptions,
  MapFnUndefinedWithOptions,
  MapFnWithOptions
} from './types.ts';
import { isMapFnDefaultValueFn, validateCreateMapFnResult } from './utils.ts';

export function createMapFnWithOptions<I extends MapFnInput, O, Options = object>(
  map: Partial<Record<I, (options: Options) => O>>,
  createMapOptions?: MapFnOptions<I, O>
): MapFnWithOptions<I, O, Options> {
  return (input: I, options: Options, mapOptions?: MapFnOptions<I, O>): O => {
    const fn = map[input];
    if (typeof fn !== 'function') {
      return validateCreateMapFnResult<I, O>(input, undefined, createMapOptions, mapOptions);
    }
    const output: O | undefined = fn(options);
    return validateCreateMapFnResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnWithOptionsUndefined<I extends MapFnInput, O, Options = object>(
  map: Partial<Record<I, (options: Options) => O>>,
  createMapOptions?: MapFnUndefinedOptions<I, O>
): MapFnUndefinedWithOptions<I, O, Options> {
  return (input: I, options: Options, mapOptions?: MapFnUndefinedOptions<I, O>): O | undefined => {
    const { defaultValue } = { ...createMapOptions, ...mapOptions };
    const fn = map[input];
    const value = fn?.(options);
    if (value !== undefined) {
      return value;
    }
    return defaultValue !== undefined && isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  };
}
