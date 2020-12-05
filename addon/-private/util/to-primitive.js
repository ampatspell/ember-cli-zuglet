import { guidFor } from '@ember/object/internals';
import { getState } from '../model/state';

export const toPrimitive = model => {
  if(!model) {
    return;
  }
  let name = getState(model, { optional: true })?.modelName || model.constructor.name;
  return `${name}::${guidFor(model)}`;
}
