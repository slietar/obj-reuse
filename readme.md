# obj-reuse

This package processes objects to reuse existing references when those are unchanged. It is useful when the data producer provides a new object for each update but the data consumer relies on shallow testing for optimization, such as [React's `memo` function](https://react.dev/reference/react/memo).

It has support for the following objects:

- `Array`
- `Object` (including objects with a null prototype)
- `Map` (reusing the value only as it is impossible to tell which key was which)
- `Date`
- `RegExp`
- `URL`

In the case of partial reuse, the new object provided as input is not used but a copy is created instead.


## Installation

```sh
$ npm install obj-reuse
```


## Usage

```js
import reuse from 'obj-reuse';

let old = {
  foo: [5, 6],
  bar: 7
};

let updated = {
  foo: [5, 6],
  bar: 8
};

let result = reuse(updated, old);
// Here 'updated.foo' was left unchanged and thus reused, meaning 'result.foo === old.foo'

let result = reuse(updated, old, (updated, old) => {
  // Logic for custom reuse
  // ...

  // By default, skip reuse entirely
  return updated;
});
```
