export type MapKey = string | number;

export type MapFnCustomTransformer<I extends MapKey, O> = (input: I) => O | undefined;

export type MapFnDefaultValue<O> = Exclude<O, (...args: Array<unknown>) => unknown>;
export type MapFnDefaultValueFn<I extends MapKey, O> = (input: I) => O;
export type MapFnDefaultValueCombined<I extends MapKey, O> = MapFnDefaultValue<O> | MapFnDefaultValueFn<I, O>;

export type MapFnErrorMessage<I extends MapKey> = (input: I) => string;

export type ArgumentMapFnCustomTransformer<I extends MapKey, O, A = 'object'> = (
  input: I,
  argument: A
) => O | undefined;

export type ArgumentMapFnDefaultValueFn<I extends MapKey, O, A = 'object'> = (input: I, argument: A) => O;
export type ArgumentMapFnDefaultValueCombined<I extends MapKey, O, A = 'object'> =
  | MapFnDefaultValue<O>
  | ArgumentMapFnDefaultValueFn<I, O, A>;

export type ArgumentMapFnErrorMessage<I extends MapKey, A = 'object'> = (input: I, argument: A) => string;

// Direct
export type MapFnOptions<I extends MapKey, O> = {
  customTransformer?: MapFnCustomTransformer<I, O>;
  defaultValue?: MapFnDefaultValueCombined<I, O>;
  errorMessage?: MapFnErrorMessage<I>;
};
export type MapFnUndefinedOptions<I extends MapKey, O> = Omit<MapFnOptions<I, O>, 'errorMessage'>;

export type MapFn<I extends MapKey, O> = (input: I, mapOptions?: MapFnOptions<I, O>) => O;
export type MapFnUndefined<I extends MapKey, O> = (input: I, mapOptions?: MapFnUndefinedOptions<I, O>) => O | undefined;

// Reverse
export type ReverseMapFnOptions<I extends MapKey, O extends MapKey> = MapFnOptions<O, I>;
export type ReverseMapFnUndefinedOptions<I extends MapKey, O extends MapKey> = Omit<
  ReverseMapFnOptions<I, O>,
  'errorMessage'
>;

export type ReverseMapFn<I extends MapKey, O extends MapKey> = (output: O, mapOptions?: ReverseMapFnOptions<I, O>) => I;
export type ReverseMapFnUndefined<I extends MapKey, O extends MapKey> = (
  output: O,
  options?: ReverseMapFnUndefinedOptions<I, O>
) => I | undefined;

// With argument
export type ArgumentMapFnResolver<O, A = 'object'> = (argument: A) => O;

export type ArgumentMapFnOptions<I extends MapKey, O, A = 'object'> = {
  customTransformer?: ArgumentMapFnCustomTransformer<I, O, A>;
  defaultValue?: ArgumentMapFnDefaultValueCombined<I, O, A>;
  errorMessage?: ArgumentMapFnErrorMessage<I, A>;
};
export type ArgumentMapFnUndefinedOptions<I extends MapKey, O, A = 'object'> = Omit<
  ArgumentMapFnOptions<I, O, A>,
  'errorMessage'
>;

export type ArgumentMapFn<I extends MapKey, O, A = 'object'> = (
  input: I,
  argument: A,
  mapOptions?: ArgumentMapFnOptions<I, O, A>
) => O;
export type ArgumentMapFnUndefined<I extends MapKey, O, A = 'object'> = (
  input: I,
  options: A,
  mapOptions?: ArgumentMapFnUndefinedOptions<I, O, A>
) => O | undefined;
