import { isArray } from '@ember/array';

export const objectToJSON = value => {
  if(value) {
    if(value.serialized) {
      return value.serialized;
    } else if(isArray(value)) {
      return value.map(object => objectToJSON(object));
    }
  }
  return value;
}
