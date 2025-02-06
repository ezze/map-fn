export type MapKey = string | number;

export type MapFnCustomTransformer<I extends MapKey, O> = (input: I) => O | undefined;

export type MapFnDefaultValue<O> = Exclude<O, (...args: Array<unknown>) => unknown>;
export type MapFnDefaultValueFn<I extends MapKey, O> = (input: I) => O;
export type MapFnDefaultValueCombined<I extends MapKey, O> = MapFnDefaultValue<O> | MapFnDefaultValueFn<I, O>;

// Direct
export type MapFnOptions<I extends MapKey, O> = {
  customTransformer?: MapFnCustomTransformer<I, O>;
  defaultValue?: MapFnDefaultValueCombined<I, O>;
  errorMessage?: (input: I) => string;
};
export type MapFnUndefinedOptions<I extends MapKey, O> = Omit<MapFnOptions<I, O>, 'errorMessage'>;

export type MapFn<I extends MapKey, O> = (input: I, mapOptions?: MapFnOptions<I, O>) => O;
export type MapFnUndefined<I extends MapKey, O> = (input: I, mapOptions?: MapFnUndefinedOptions<I, O>) => O | undefined;

// With options
export type MapFnWithOptions<I extends MapKey, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnOptions<I, O>
) => O;
export type MapFnUndefinedWithOptions<I extends MapKey, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnUndefinedOptions<I, O>
) => O | undefined;

// Reverse
export type ReverseMapFnOptions<I extends MapKey, O extends MapKey> = MapFnOptions<O, I>;
export type ReverseMapFnUndefinedOptions<I extends MapKey, O extends MapKey> = Omit<
  ReverseMapFnOptions<I, O>,
  'errorMessage'
>;

export type ReverseMapFn<I extends MapKey, O extends MapKey> = (output: O, options?: ReverseMapFnOptions<I, O>) => I;
export type ReverseMapFnUndefined<I extends MapKey, O extends MapKey> = (
  output: O,
  options?: ReverseMapFnUndefinedOptions<I, O>
) => I | undefined;
