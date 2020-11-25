import { guidFor } from '@ember/object/internals';

export const toPrimitive = model => {
  if(!model) {
    return;
  }
  return `${model.constructor.name}::${guidFor(model)}`;
}
