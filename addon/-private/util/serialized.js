import { computed } from '@ember/object';

export default keys => computed(...keys, function() {
  return this.getProperties(keys);
}).readOnly();
