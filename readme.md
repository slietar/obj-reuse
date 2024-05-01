# obj-reuse

This package process an object to reuse existing references when those are unchanged. It is useful when the data producer provides a new object for each update but the data consumer relies on shallow testing for optimization, such as [React's `memo` function](https://react.dev/reference/react/memo).

It has support for the following objects:

- objects and arrays
- `Map`


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
// Both 'updated' and 'old' were left unchanged, however 'old.foo' was reused, meaning 'result.foo === old.foo'
```
