export const sortedBy = (array, arg) => {
  let fn = model => model[arg];
  if(typeof arg === 'function') {
    fn = arg;
  }
  return [ ...array ].sort((a, b) => {
    a = fn(a);
    b = fn(b);
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
