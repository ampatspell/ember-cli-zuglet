import { guidFor } from '@ember/object/internals';
import { getModelName } from './model-factory';

export const toPrimitive = model => {
  if(!model) {
    return;
  }
  let name = getModelName(model) || model.constructor.name;
  return `${name}::${guidFor(model)}`;
};
