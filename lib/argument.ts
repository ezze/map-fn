import {
  ArgumentMapFn,
  ArgumentMapFnOptions,
  ArgumentMapFnResolver,
  ArgumentMapFnUndefined,
  ArgumentMapFnUndefinedOptions,
  MapKey
} from './types.ts';
import { validateCreateArgumentMapFnResult, validateCreateArgumentMapFnUndefinedResult } from './utils.ts';

export function createArgumentMapFn<I extends MapKey, O, A = object>(
  map: Partial<Record<I, (argument: A) => O>>,
  createMapOptions?: ArgumentMapFnOptions<I, O, A>
): ArgumentMapFn<I, O, A> {
  return (input: I, argument: A, mapOptions?: ArgumentMapFnOptions<I, O, A>): O => {
    const fn = map[input];
    const output: O | undefined = typeof fn === 'function' ? fn(argument) : undefined;
    return validateCreateArgumentMapFnResult<I, O, A>(input, output, argument, createMapOptions, mapOptions);
  };
}

export function createArgumentMapFnStrict<I extends MapKey, O, A = object>(
  map: Record<I, ArgumentMapFnResolver<O, A>>
): ArgumentMapFn<I, O, A> {
  return createArgumentMapFn<I, O, A>(map);
}

export function createArgumentMapFnUndefined<I extends MapKey, O, A = object>(
  map: Partial<Record<I, (options: A) => O>>,
  createMapOptions?: ArgumentMapFnUndefinedOptions<I, O, A>
): ArgumentMapFnUndefined<I, O, A> {
  return (input: I, argument: A, mapOptions?: ArgumentMapFnUndefinedOptions<I, O, A>): O | undefined => {
    const fn = map[input];
    const output: O | undefined = typeof fn === 'function' ? fn(argument) : undefined;
    return validateCreateArgumentMapFnUndefinedResult<I, O, A>(input, output, argument, createMapOptions, mapOptions);
  };
}

export function createArgumentMapFnStrictUndefined<I extends MapKey, O, A = object>(
  map: Record<I, ArgumentMapFnResolver<O, A>>
): ArgumentMapFnUndefined<I, O, A> {
  return createArgumentMapFnUndefined<I, O, A>(map);
}
