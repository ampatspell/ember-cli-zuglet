import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../model-mixin';
import QueryableMixin from './queryable-mixin';

export default EmberObject.extend(ModelMixin, QueryableMixin, {

  type: readOnly('_internal.type'),
  args: readOnly('_internal.args'),

  parent: computed(function() {
    let parent =  this._internal.get('parent');
    return parent && parent.model(true);
  }),

  serialized: readOnly('_internal.serialized'),

  toStringExtension() {
    let string = this.get('_internal.string');
    return `${string}`;
  }

});
