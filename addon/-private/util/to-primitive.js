import { guidFor } from '@ember/object/internals';

export default model => {
  return `${model.constructor.name}::${guidFor(model)}`;
}
