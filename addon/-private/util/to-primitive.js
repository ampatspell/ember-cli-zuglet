import { guidFor } from '@ember/object/internals';

export const toPrimitive = model => {
  return `${model.constructor.name}::${guidFor(model)}`;
}
