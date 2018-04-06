import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';

export default keys => Mixin.create(keys.reduce((props, key) => {
  props[key] = readOnly(`_internal.${key}`);
  return props;
}, {}));
