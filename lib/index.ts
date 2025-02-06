import {
  createArgumentMapFn,
  createArgumentMapFnStrict,
  createArgumentMapFnUndefined,
  createArgumentMapFnStrictUndefined
} from './argument.ts';
import { MappingError } from './error.ts';
import { createMapFn, createMapFnStrict, createMapFnUndefined, createMapFnStrictUndefined } from './map.ts';
import {
  createReverseMapFn,
  createReverseMapFnStrict,
  createReverseMapFnUndefined,
  createReverseMapFnStrictUndefined
} from './reverse.ts';

export {
  // Direct
  createMapFn,
  createMapFnStrict,
  createMapFnUndefined,
  createMapFnStrictUndefined,
  // Reverse
  createReverseMapFn,
  createReverseMapFnStrict,
  createReverseMapFnUndefined,
  createReverseMapFnStrictUndefined,
  // With argument
  createArgumentMapFn,
  createArgumentMapFnStrict,
  createArgumentMapFnUndefined,
  createArgumentMapFnStrictUndefined,
  // Error
  MappingError
};
