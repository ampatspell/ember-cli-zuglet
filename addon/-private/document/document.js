import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import createReadOnlyPropertiesMixin from '../internal/read-only-props-mixin';
import ModelMixin from '../internal/model-mixin';
import { state, meta } from './internal';
import serialized from '../util/serialized';
import { invokePromiseReturningThis, invoke } from '../internal/invoke';

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

const ref = key => readOnly(`ref.${key}`);

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  isDocument: true,

  ref: computed('_internal.ref', function() {
    return this.get('_internal.ref').model(true);
  }).readOnly(),

  id: ref('id'),
  path: ref('path'),

  data: readOnly('_internal.data'),

  serialized: serialized([ 'id', 'path', ...state, ...meta, 'data' ]),

  load:    invokePromiseReturningThis('load'),
  reload:  invokePromiseReturningThis('reload'),
  save:    invokePromiseReturningThis('save'),
  delete:  invokePromiseReturningThis('delete'),
  observe: invoke('observe'),

  toStringExtension() {
    let path = this.get('path');
    return `${path}`;
  }

});
