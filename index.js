/**
 * Process an object to reuse existing references when those are unchanged.
 * @template T
 * @param {T} updated The new object.
 * @param {T} old The object to use as reference for reuse.
 * @param {function(T, T): T} [fallbackReuse] A fallback function to use when no reuse is possible.
 * @returns {T} The updated object with reused references.
 */
export function reuse(updated, old, fallbackReuse) {
  if (
    (typeof old === 'object') &&
    (typeof updated === 'object') &&
    (old !== null) &&
    (updated !== null)
  ) {
    if (Array.isArray(old) && Array.isArray(updated)) {
      let reusedItems = updated.map((updatedItem, index) => reuse(updatedItem, old[index]));

      if (
        (reusedItems.length === old.length) &&
        reusedItems.every((reusedItem, index) => reusedItem === old[index])
      ) {
        return old;
      }

      return reusedItems;
    }

    if (old.constructor === updated.constructor) {
      switch (old.constructor) {
        case Map: {
          let reusedItems = new Map(
            Array.from(updated.entries()).map(([key, updatedValue]) => [key,
              old.has(key)
                ? reuse(updatedValue, old.get(key))
                : updatedValue
            ])
          );

          if (
            (reusedItems.size === old.size) &&
            Array.from(reusedItems.entries()).every(([key, reusedValue]) => reusedValue === old.get(key))
          ) {
            return old;
          }

          return reusedItems;
        }

        case Object:
        case null: {
          let reuseOld = true;
          let result = Object.create(Object.getPrototypeOf(updated));

          for (let key of [...Object.getOwnPropertyNames(updated), ...Object.getOwnPropertySymbols(updated)]) {
            if (Object.hasOwn(old, key)) {
              result[key] = reuse(updated[key], old[key]);
              reuseOld &&= result[key] === old[key];
            } else {
              result[key] = updated[key];
              reuseOld = false;
            }
          }

          if (reuseOld) {
            for (let key of [...Object.getOwnPropertyNames(old), ...Object.getOwnPropertySymbols(old)]) {
              if (!Object.hasOwn(updated, key)) {
                return result;
              }
            }

            return old;
          }

          return result;
        }

        case Date: {
          return old.getTime() === updated.getTime()
            ? old
            : updated;
        }

        case RegExp: {
          return (old.source === updated.source) && (old.flags === updated.flags)
            ? old
            : updated;
        }

        case URL: {
          return old.href === updated.href
            ? old
            : updated;
        }
      }
    }
  }

  if (fallbackReuse) {
    return fallbackReuse(updated, old);
  }

  return updated;
}

export default reuse;


let s = Symbol();

let x = {
  foo: 42,
  bar: [1, 6],
  z: new Date(),
  [s]: 8
};

let y = {
  foo: 42,
  bar: [1, 6],
  z: new Date(),
  [s]: 8
};

let yp = reuse(y, x);

console.log(yp);
console.log(yp === x); // true
