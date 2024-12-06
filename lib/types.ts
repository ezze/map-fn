export type MapFnInput = string | number;
export type MapFnCustomTransformer<I extends MapFnInput, O> = (input: I) => O | undefined;

export type MapFnDefaultValue<O> = Exclude<O, (...args: Array<unknown>) => unknown>;
export type MapFnDefaultValueFn<I extends MapFnInput, O> = (input: I) => O;
export type MapFnDefaultValueCombined<I extends MapFnInput, O> = MapFnDefaultValue<O> | MapFnDefaultValueFn<I, O>;

export type MapFnOptions<I extends MapFnInput, O> = {
  customTransformer?: MapFnCustomTransformer<I, O>;
  defaultValue?: MapFnDefaultValueCombined<I, O>;
  errorMessage?: (input: I) => string;
};
export type MapFnUndefinedOptions<I extends MapFnInput, O> = Omit<MapFnOptions<I, O>, 'errorMessage'>;

export type MapFn<I extends MapFnInput, O> = (input: I, mapOptions?: MapFnOptions<I, O>) => O;
export type MapFnUndefined<I extends MapFnInput, O> = (
  input: I,
  mapOptions?: MapFnUndefinedOptions<I, O>
) => O | undefined;

export type MapFnWithOptions<I extends MapFnInput, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnOptions<I, O>
) => O;
export type MapFnUndefinedWithOptions<I extends MapFnInput, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnUndefinedOptions<I, O>
) => O | undefined;

export type ReverseMapFnCustomTransformer<I extends MapFnInput, O> = (output: O) => I | undefined;

export type ReverseMapFnOptions<I extends MapFnInput, O> = {
  customTransformer?: ReverseMapFnCustomTransformer<I, O>;
  defaultValue?: I;
  errorMessage?: (output: O) => string;
};
export type ReverseMapFnUndefinedOptions<I extends MapFnInput, O> = Omit<ReverseMapFnOptions<I, O>, 'errorMessage'>;
