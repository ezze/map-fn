# map-fn

![https://www.npmjs.com/package/map-fn](https://img.shields.io/npm/v/map-fn)
![https://github.com/ezze/map-fn/blob/HEAD/LICENSE.md](https://img.shields.io/github/license/ezze/map-fn)

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
   
Please note that `defaultValue` can also be a function similar to `customTransformer` except it can't return `undefined`. You can combine both `customTransformer` and `defaultValue`, the former takes precedence.
   
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

The same options as for basic mapping function creators are available for reverse function creators, the difference is input/output generic types are swapped.

## Mapping with argument

For advanced cases one may consider using `createArgumentMapFn` or `createArgumentMapFnUndefined` mapping function creators. They provide additional input argument in mapping configuration:

```typescript
import { createArgumentMapFn } from '../lib';

abstract class Person {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
  
  ...
}

class Musician implements Person { ... }

class Poet implements Person { ...}

type PersonType = 'musician' | 'poet';

const mapPerson = createArgumentMapFn<PersonType, Person, number>({
  musician: (id) => new Musician(id),
  poet: (id) => new Poet(id)
});

const musician = mapPerson('musician', 1);
console.log(musician instanceof Musician); // true
console.log(musician instanceof Poet); // false

const poet = mapPerson('poet', 2);
console.log(poet instanceof Musician); // false
console.log(poet instanceof Poet); // true
```

## Strict

Mapping functions described above don't guarantee that all input values have matched output ones (that's why `defaultValue` and `customTransformer` exist). If you want to control exhaustive matches between input and output values in TypeScript then strict functions come to the party:

```typescript
const mapAB = createMapFnStrict<A, B>({
  foo: 'FOO',
  bar: 'BAR',
  baz: 'BAZ'
});
```

The following will trigger type checking error because mapping object is incomplete:

```typescript
const mapAB = createMapFnStrict<A, B>({
  foo: 'FOO',
  bar: 'BAR'
}); // baz property is missing
```

This is the full list of strict functions:

- `createMapFnStrict`;
- `createMapFnStrictUndefined`;
- `createReverseMapFnStrict`;
- `createReverseMapFnStrictUndefined`;
- `createArgumentMapFnStrict`;
- `createArgumentMapFnStrictUndefined`.

## License

[MIT](LICENSE.md)
