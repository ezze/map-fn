# map-fn

A set of utility functions to map one type of values to another one with ease.

## Installation

```
pnpm add map-fn -P
```

## Usage

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
console.log(mapAB('baz')); // MappingError
```

There are three options to avoid `MappingError` in such cases:

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

3. Use `createMapFnUndefined` instead. Please note that output type will be `B | undefined` (not `B`):

   ```typescript
   const mapAB = createMapFnUndefined<A, B>({
     foo: 'FOO',
     bar: 'BAR'
   });
   
   console.log(mapAB('baz')); // undefined
   ```

## License

[MIT](LICENSE.md)
