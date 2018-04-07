import EmberObject from '@ember/object';
import { equal, readOnly } from '@ember/object/computed';
import ModelMixin from '../model-mixin';
import createReadOnlyPropertiesMixin from '../util/create-read-only-properties-mixin';
import serialized from '../util/serialized';
import { state, meta } from './internal';

const StateMixin = createReadOnlyPropertiesMixin(state);
const MetaMixin = createReadOnlyPropertiesMixin(meta);

const type = value => equal('type', value).readOnly();

export default EmberObject.extend(ModelMixin, StateMixin, MetaMixin, {

  isQuery: true,

  type: readOnly('_internal.type'),
  query: readOnly('_internal.query'),

  isArray: type('array'),
  isFirst: type('first'),

  serialized: serialized([ ...state, ...meta ]),

  load() {
    return this._internal.load().then(() => this);
  },

  observe() {
    return this._internal.observe();
  },

  toStringExtension() {
    let query = this.get('query.string');
    return `${query}`;
  }

});
