/**
 * Process an object to reuse existing references when those are unchanged.
 * @template T
 * @param {T} updated The new object.
 * @param {T} old The object to use as reference for reuse.
 * @returns {T} The updated object with reused references.
 */
export function reuse(updated, old) {
  if (
    (typeof old === 'object') &&
    (typeof updated === 'object') &&
    (old !== null) &&
    (updated !== null)
  ) {
    if (Array.isArray(old) && Array.isArray(updated)) {
      let reusedItems = updated.map((updatedItem, index) => reuse(updatedItem, old[index]));

      if ((reusedItems.length === old.length) && reusedItems.every((reusedItem, index) => reusedItem === old[index])) {
        return old;
      }

      return reusedItems;
    }

    if ((old.constructor === Map) && (updated.constructor === Map)) {
      let reusedItems = new Map(Array.from(updated.entries()).map(([key, updatedValue]) => [key,
        old.has(key)
          ? reuse(updatedValue, old.get(key))
          : updatedValue
      ]));

      if ((reusedItems.size === old.size) && Array.from(reusedItems.entries()).every(([key, reusedValue]) => reusedValue === old.get(key))) {
        return old;
      }

      return reusedItems;
    }

    if ((old.constructor === Object) && (updated.constructor === Object)) {
      let reuseOld = true;

      for (let key in updated) {
        if (old.hasOwnProperty(key)) {
          updated[key] = reuse(updated[key], old[key]);
          reuseOld &&= updated[key] === old[key];
        }
      }

      for (let key in old) {
        if (!updated.hasOwnProperty(key)) {
          reuseOld = false;
          break;
        }
      }

      return reuseOld
        ? old
        : updated;
    }
  }

  return updated;
}

export default reuse;


let x = {
  foo: 42,
  bar: [1, 6]
};

let y = {
  foo: 42,
  bar: [1, 6]
};

let yp = reuse(y, x);

console.log(yp === x); // true
