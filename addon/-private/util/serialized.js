import { computed } from '@ember/object';

export default (keys, keep=true) => computed(...keys, function() {
  let props = this.getProperties(keys);

  if(keep === true) {
    return props;
  }

  return keys.reduce((hash, key) => {
    let value = props[key];
    if(value !== undefined || keep.includes(key)) {
      hash[key] = value;
    }
    return hash;
  }, {});
}).readOnly();
