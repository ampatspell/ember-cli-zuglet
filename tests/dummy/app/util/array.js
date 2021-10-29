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

export const firstObject = array => {
  return array && array[0];
}

export const lastObject = array => {
  return array && array[array.length - 1];
}

export const nextObject = (array, object, wrap=false) => {
  let idx = array.indexOf(object);
  if(idx === -1) {
    return;
  }
  if(idx === array.length - 1) {
    if(wrap) {
      return firstObject(array);
    }
    return;
  }
  return array[idx + 1];
}

export const prevObject = (array, object, wrap=false) => {
  let idx = array.indexOf(object);
  if(idx === -1) {
    return;
  }
  if(idx === 0) {
    if(wrap) {
      return lastObject(array);
    }
    return;
  }
  return array[idx - 1];
}
