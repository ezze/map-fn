import { MappingError } from './error.ts';
import {
  MapFnDefaultValueCombined,
  MapFnDefaultValueFn,
  MapFnInput,
  MapFnOptions,
  MapFnUndefinedOptions,
  ReverseMapFnOptions
} from './types.ts';

export function isMapFnDefaultValueFn<I extends MapFnInput, O>(
  defaultValue: MapFnDefaultValueCombined<I, O>
): defaultValue is MapFnDefaultValueFn<I, O> {
  return typeof defaultValue === 'function';
}

export function validateCreateMapFnResult<I extends MapFnInput, O>(
  input: I,
  output: O | undefined,
  createMapOptions?: MapFnOptions<I, O>,
  mapOptions?: MapFnOptions<I, O>
): O {
  const combinedMapOptions: MapFnOptions<I, O> = { ...createMapOptions, ...mapOptions };

  const {
    customTransformer,
    defaultValue,
    errorMessage = (input: I) => `Unable to map "${input}", default value is not provided`
  } = combinedMapOptions;

  const o = output === undefined && typeof customTransformer === 'function' ? customTransformer(input) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      throw new MappingError(errorMessage(input));
    }
    return isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  }
  return o;
}

export function validateCreateMapFnUndefinedResult<I extends MapFnInput, O>(
  input: I,
  output: O | undefined,
  createMapOptions?: MapFnUndefinedOptions<I, O>,
  mapOptions?: MapFnUndefinedOptions<I, O>
): O | undefined {
  const combinedMapOptions: MapFnUndefinedOptions<I, O> = { ...createMapOptions, ...mapOptions };

  const { customTransformer, defaultValue } = combinedMapOptions;

  const o = output === undefined && typeof customTransformer === 'function' ? customTransformer(input) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      return undefined;
    }
    return isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  }
  return o;
}

export function validateCreateReverseMapFnResult<I extends MapFnInput, O>(
  output: O,
  input: I | undefined,
  options?: ReverseMapFnOptions<I, O>
): I {
  const {
    customTransformer,
    defaultValue,
    errorMessage = (output: O) => `Unable to map "${output}", default value is not provided`
  } = options || {};

  const i = input === undefined && typeof customTransformer === 'function' ? customTransformer(output) : input;
  if (i === undefined) {
    if (defaultValue === undefined) {
      throw new MappingError(errorMessage(output));
    }
    return defaultValue;
  }
  return i;
}
