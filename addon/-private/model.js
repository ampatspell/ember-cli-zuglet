const marker = Symbol("ZUGLET");
const value = 'model';

export const isModel = instance => {
  return instance && instance.constructor[marker] === value;
}

export const model = Class => {
  Class[marker] = value;
  return Class;
}
