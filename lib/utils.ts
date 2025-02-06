import { MappingError } from './error.ts';
import {
  ArgumentMapFnDefaultValueCombined,
  ArgumentMapFnDefaultValueFn,
  ArgumentMapFnOptions,
  ArgumentMapFnUndefinedOptions,
  MapFnDefaultValueCombined,
  MapFnDefaultValueFn,
  MapFnOptions,
  MapFnUndefinedOptions,
  MapKey
} from './types.ts';

export function isMapFnDefaultValueFn<I extends MapKey, O>(
  defaultValue: MapFnDefaultValueCombined<I, O>
): defaultValue is MapFnDefaultValueFn<I, O> {
  return typeof defaultValue === 'function' && defaultValue.length === 1;
}

export function isArgumentMapFnDefaultValueFn<I extends MapKey, O, A = 'object'>(
  defaultValue: ArgumentMapFnDefaultValueCombined<I, O, A>
): defaultValue is ArgumentMapFnDefaultValueFn<I, O, A> {
  return typeof defaultValue === 'function' && defaultValue.length === 2;
}

export function validateCreateMapFnResult<I extends MapKey, O>(
  input: I,
  output: O | undefined,
  createMapOptions?: MapFnOptions<I, O>,
  mapOptions?: MapFnOptions<I, O>
): O {
  const combinedMapOptions: MapFnOptions<I, O> = { ...createMapOptions, ...mapOptions };

  const {
    customTransformer,
    defaultValue,
    errorMessage = (input: I): string => `Unable to map "${input}", default value is not provided`
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

export function validateCreateMapFnUndefinedResult<I extends MapKey, O>(
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

export function validateCreateArgumentMapFnResult<I extends MapKey, O, A = 'object'>(
  input: I,
  output: O | undefined,
  argument: A,
  createMapOptions?: ArgumentMapFnOptions<I, O, A>,
  mapOptions?: ArgumentMapFnOptions<I, O, A>
): O {
  const combinedMapOptions: ArgumentMapFnOptions<I, O, A> = { ...createMapOptions, ...mapOptions };

  const {
    customTransformer,
    defaultValue,
    errorMessage = (input: I, argument: A): string => {
      const arg = `${argument && typeof argument === 'object' ? argument.toString() : argument}`;
      return `Unable to map "${input}" with argument "${arg}", default value is not provided`;
    }
  } = combinedMapOptions;

  const o =
    output === undefined && typeof customTransformer === 'function' ? customTransformer(input, argument) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      throw new MappingError(errorMessage(input, argument));
    }
    return isArgumentMapFnDefaultValueFn<I, O, A>(defaultValue) ? defaultValue(input, argument) : defaultValue;
  }
  return o;
}

export function validateCreateArgumentMapFnUndefinedResult<I extends MapKey, O, A = 'object'>(
  input: I,
  output: O | undefined,
  argument: A,
  createMapOptions?: ArgumentMapFnUndefinedOptions<I, O, A>,
  mapOptions?: ArgumentMapFnUndefinedOptions<I, O, A>
): O | undefined {
  const combinedMapOptions: ArgumentMapFnUndefinedOptions<I, O, A> = { ...createMapOptions, ...mapOptions };

  const { customTransformer, defaultValue } = combinedMapOptions;

  const o =
    output === undefined && typeof customTransformer === 'function' ? customTransformer(input, argument) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      return undefined;
    }
    return isArgumentMapFnDefaultValueFn<I, O, A>(defaultValue) ? defaultValue(input, argument) : defaultValue;
  }
  return o;
}
