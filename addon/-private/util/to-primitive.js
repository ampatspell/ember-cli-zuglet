import { guidFor } from '@ember/object/internals';

export const MODEL_NAME = Symbol('ZUGLET_FACTORY');

export const toPrimitive = model => {
  if(!model) {
    return;
  }
  let name = model[MODEL_NAME] || model.constructor.name;
  return `${name}::${guidFor(model)}`;
}
