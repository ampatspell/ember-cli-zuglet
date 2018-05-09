import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import createReadOnlyPropertiesMixin from '../internal/read-only-props-mixin';
import ModelMixin from '../internal/model-mixin';
import { state, meta } from './internal';
import { invokePromiseReturningThis, invoke, invokeReturningModel } from '../internal/invoke';

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

const ref = key => readOnly(`ref.${key}`);

const serialized = [ 'id', 'path', ...state, ...meta ];

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  isDocument: true,

  ref: computed('_internal.ref', function() {
    return this.get('_internal.ref').model(true);
  }).readOnly(),

  id: ref('id'),
  path: ref('path'),

  data: computed(function() {
    return this.get('_internal.data').model(true);
  }).readOnly(),

  serialized: computed(...serialized, 'data.serialized', function() {
    let props = this.getProperties(...serialized);
    props.data = this.get('data.serialized');
    return props;
  }).readOnly(),

  load:    invokePromiseReturningThis('load'),
  reload:  invokePromiseReturningThis('reload'),
  save:    invokePromiseReturningThis('save'),
  delete:  invokePromiseReturningThis('delete'),

  observe: invokeReturningModel('observe'),

  reset: invoke('reset'),

  toStringExtension() {
    let path = this.get('path');
    return `${path}`;
  }

});
