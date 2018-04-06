import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Internal from '../internal';

export default Internal.extend({

  store: null,
  ref: null,

  path: readOnly('ref.path'),

  parent: computed(function() {
    let parent = this.ref.parent;
    if(!parent) {
      return null;
    }
    return this.createParentInternal(parent);
  })

});