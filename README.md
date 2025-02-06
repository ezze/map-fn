# map-fn

![](https://img.shields.io/npm/v/map-fn)

A set of utility functions to map one type of values to another one with ease.

## Installation

```
pnpm add map-fn -P
```

## Basic usage

```typescript
import { createMapFn } from 'map-fn';

type A = 'foo' | 'bar' | 'baz';
type B = 'FOO' | 'BAR' | 'BAZ';

const mapAB = createMapFn<A, B>({
  foo: 'FOO',
  bar: 'BAR'
});

console.log(mapAB('foo')); // 'FOO'
console.log(mapAB('bar')); // 'BAR'
```

If no corresponding value is provided then `MappingError` will be thrown:

```typescript
console.log(mapAB('baz')); // MappingError: Unable to map "baz", default value is not provided
```

You can provide alternative error message:

```typescript
const mapAB = createMapFn<A, B>({
  foo: 'FOO',
  bar: 'BAR'
}, { errorMessage: (input: A): string => `No value found for "${input}"` });

console.log(mapAB('baz')); // MappingError: No value found for "baz" 
```

or

```typescript
const mapAB = createMapFn<A, B>({
  foo: 'FOO',
  bar: 'BAR'
});

console.log(mapAB('baz', { errorMessage: (input: A): string => `No value found for "${input}"` })); // Mapping error: No value found for "baz"
```

There are few options available to avoid `MappingError` in such cases:

1. Provide default value in `createMapFn`:

   ```typescript
   const mapAB = createMapFn<A, B>({
     foo: 'FOO',
     bar: 'BAR'
   }, { defaultValue: 'BAZ' });
   
   console.log(mapAB('baz')); // 'BAZ'
   ```

2. Provide default value calling mapping function:

   ```typescript
   const mapAB = createMapFn<A, B>({
     foo: 'FOO',
     bar: 'BAR'
   });
   
   console.log(mapAB('baz', { defaultValue: 'BAZ' })); // 'BAZ'
   ```
   
3. Use `customTransformer` option for custom value transformation in `createMapFn`:

   ```typescript
   const mapAB = createMapFn<A, B>(
     { foo: 'FOO' },
     {
       customTransformer: (value: A) => B {
         return value === 'bar' ? 'BAZ' : 'BAR';
       }
     }
   );
   
   console.log(mapAB('bar')); // 'BAZ'
   console.log(mapAB('baz')); // 'BAR'
   ```
   
4. Provide `customTransformer` option calling mapping function:

   ```typescript
   const mapAB = createMapFn<A, B>({ foo: 'FOO' });
   const customTransformer = (value: A) => B {
     return value === 'bar' ? 'BAZ' : 'BAR';
   };
   
   console.log(mapAB('bar', { customTransformer })); // 'BAZ'
   console.log(mapAB('baz', { customTransformer })); // 'BAR'
   ```

5. Use `createMapFnUndefined` instead. Please note that output type will be `B | undefined` (not `B`):

   ```typescript
   const mapAB = createMapFnUndefined<A, B>({
     foo: 'FOO',
     bar: 'BAR'
   });
   
   console.log(mapAB('baz')); // undefined
   ```
   
## Reverse mapping

Sometimes you may want to make backward transformations without need to declare reversed map. `createReverseMap` and `createReverseMapUndefined` functions are created for this purpose. The only restriction here is that type of original map values must extend `number` or `string`.

```typescript
const mapBA = createReverseMap<A, B>({
  foo: 'FOO',
  bar: 'BAR'
});

console.log(mapBA('FOO')); // 'foo'
console.log(mapBA('BAR')); // 'bar'
```

The same default value options as for basic mapping function creators are available for reverse function creators, the difference is input/output generic types are swapped.

## License

[MIT](LICENSE.md)
