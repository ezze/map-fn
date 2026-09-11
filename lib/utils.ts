import { MappingError } from './error.ts';
import {
  ArgumentMapFnOptions,
  ArgumentMapFnUndefinedOptions,
  MapFnOptions,
  MapFnUndefinedOptions,
  MapKey,
  MapOutput
} from './types.ts';

export function validateCreateMapFnResult<I extends MapKey, O extends MapOutput>(
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
    return typeof defaultValue === 'function' ? defaultValue(input) : defaultValue;
  }
  return o;
}

export function validateCreateMapFnUndefinedResult<I extends MapKey, O extends MapOutput>(
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
    return typeof defaultValue === 'function' ? defaultValue(input) : defaultValue;
  }
  return o;
}

export function validateCreateArgumentMapFnResult<I extends MapKey, O extends MapOutput, A = 'object'>(
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
    return typeof defaultValue === 'function' ? defaultValue(input, argument) : defaultValue;
  }
  return o;
}

export function validateCreateArgumentMapFnUndefinedResult<I extends MapKey, O extends MapOutput, A = 'object'>(
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
    return typeof defaultValue === 'function' ? defaultValue(input, argument) : defaultValue;
  }
  return o;
}
