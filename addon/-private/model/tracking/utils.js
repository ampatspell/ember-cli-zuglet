
export const propToIndex = prop => {
  if(typeof prop === 'symbol') {
    return null;
  }
  let idx = Number(prop);
  if(isNaN(idx)) {
    return null;
  }
  return idx;
}

export const ARRAY_GETTERS = new Set([
  Symbol.iterator,
  'concat',
  'entries',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'flat',
  'flatMap',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'reduce',
  'reduceRight',
  'slice',
  'some',
  'values',
]);

export const ARRAY_MUTATORS = new Set([
  'replace',    // array.replace(start, deleteCount, items);
  'copyWithin',
  'pop',        // * removes last element
  'push',       // * push(...items)
  'reverse',
  'shift',      // * removes first element
  'sort',
  'splice',     // * adds, removes      splice(start, deleteCount, ...items);
  'unshift',    // * adds to beginning. unshift(...items)
]);
