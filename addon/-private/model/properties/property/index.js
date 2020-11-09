import Property from './property';
import { property, createProperty } from './decorator';
import { getProperty } from './get-property';

export {
  property,
  getProperty,
  createProperty
}

export const normalizeMapping = args => {
  if(typeof args[0] === 'function') {
    return args[0];
  };
  let keys = [...args];
  return owner => {
    let hash = {};
    for(let key of keys) {
      hash[key] = owner[key];
    }
    return hash;
  };
}

export default Property;
