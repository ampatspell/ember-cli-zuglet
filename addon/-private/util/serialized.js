import { computed } from '@ember/object';

export default (keys, keep=[]) => computed(...keys, function() {
  let props = this.getProperties(keys);
  return keys.reduce((hash, key) => {
    let value = props[key];
    if(value !== undefined || keep.includes(key)) {
      hash[key] = value;
    }
    return hash;
  }, {});
}).readOnly();
