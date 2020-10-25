const marker = Symbol("ZUGLET");
const value = 'root';

export const isRoot = instance => {
  return instance && instance.constructor[marker] === value;
}

export const autoactivate = Class => {
  Class[marker] = value;
  return Class;
}
