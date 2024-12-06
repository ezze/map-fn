import { MapFnInput, ReverseMapFnOptions, ReverseMapFnUndefinedOptions } from './types.ts';
import { validateCreateReverseMapFnResult } from './utils.ts';

const numericRegExp = /^\d+$/;

export function createReverseMapFn<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  mapOptions?: ReverseMapFnOptions<I, O>
): (output: O) => I {
  return (output: O): I => {
    const entries = Object.entries(map);
    for (let i = 0; i < entries.length; i += 1) {
      const [key, value] = entries[i];
      if (value === output) {
        return (numericRegExp.test(key) ? parseInt(key, 10) : key) as I;
      }
    }
    return validateCreateReverseMapFnResult<I, O>(output, undefined, mapOptions);
  };
}

export function createReverseMapFnUndefined<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  options?: ReverseMapFnUndefinedOptions<I, O>
): (output: O) => I | undefined {
  const { defaultValue } = options || {};
  return (output: O): I | undefined => {
    const entries = Object.entries(map);
    for (let i = 0; i < entries.length; i += 1) {
      const [key, value] = entries[i];
      if (value === output) {
        return (numericRegExp.test(key) ? parseInt(key, 10) : key) as I;
      }
    }
    return defaultValue;
  };
}
