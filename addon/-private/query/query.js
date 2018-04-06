import EmberObject from '@ember/object';
import ModelMixin from '../model-mixin';
import createReadOnlyPropertiesMixin from '../util/create-read-only-properties-mixin';
import serialized from '../util/serialized';
import { state, meta } from './internal';

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  serialized: serialized([ ...state, ...meta ]),

  load() {
    return this._internal.load().then(() => this);
  },

  observe() {
    return this._internal.observe();
  }

});
