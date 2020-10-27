
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
