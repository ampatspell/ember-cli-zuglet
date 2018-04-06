import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import createReadOnlyPropertiesMixin from './util/create-read-only-properties-mixin';
import ModelMixin from './model-mixin';
import { state, meta } from './document-internal';
import serialized from './util/serialized';

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

const ref = key => readOnly(`ref.${key}`);

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  ref: computed('_internal.ref', function() {
    return this.get('_internal.ref').model(true);
  }).readOnly(),

  id: ref('id'),
  path: ref('path'),

  data: readOnly('_internal.data'),

  serialized: serialized([ 'id', 'path', ...state, ...meta, 'data' ]),

  load() {
    return this._internal.load().then(() => this);
  },

  observe() {
    return this._internal.observe();
  }

});
