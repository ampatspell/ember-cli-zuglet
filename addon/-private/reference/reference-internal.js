import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Internal from '../internal';

export default Internal.extend({

  store: null,
  ref: null,
  _parent: null,

  id: readOnly('ref.id'),
  path: readOnly('ref.path'),

  parent: computed(function() {
    let parent = this.get('_parent');
    if(parent) {
      return parent;
    }

    parent = this.ref.parent;
    if(!parent) {
      return null;
    }

    return this.createParentInternal(parent);
  }),

  string: computed(function() {
    let parent = this.get('parent.string');
    let id = this.get('id');
    if(parent) {
      return `${parent}/${id}`;
    }
    return id;
  }),

  serialized: computed(function() {
    let arr = this.get('parent.serialized') || [];
    let { type, id } = this.getProperties('type', 'id');
    arr.push({ type: type, id: id });
    return arr;
  }),

});
