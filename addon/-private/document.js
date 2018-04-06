import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import createReadOnlyPropertiesMixin from './util/create-read-only-properties-mixin';
import ModelMixin from './model-mixin';
import { state, meta } from './document-internal';
import serialized from './util/serialized';

const ref = key => computed('ref', function() {
  let ref = this.get('ref');
  if(!ref) {
    return;
  }
  return ref[key];
}).readOnly();

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  ref: readOnly('_internal.ref'),

  id: ref('id'),
  path: ref('path'),

  data: readOnly('_internal.data'),

  serialized: serialized([ 'id', 'path', ...state, ...meta, 'data' ]),

});
