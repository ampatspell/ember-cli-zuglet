import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../util/model-mixin';

export default EmberObject.extend(ModelMixin, {

  isReference: true,

  id:   readOnly(`_internal.ref.id`),
  path: readOnly(`_internal.ref.path`),

  parent: computed(function() {
    let parent =  this._internal.get('parent');
    return parent && parent.model(true);
  }),

  serialized: readOnly('_internal.serialized'),
  string:     readOnly('_internal.string'),

  toStringExtension() {
    let string = this.get('string');
    return `${string}`;
  }

});
