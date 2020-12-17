import { toPrimitive } from './to-primitive';

export const toString = (model, string) => {
  if(!model) {
    return;
  }
  return `<${toPrimitive(model)}${string ? `:${string}` : ''}>`;
};
