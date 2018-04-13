import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { toInternal, isInternal } from './internal/util';

const serializers = [
  'reference',
  'array',
  'object',
  'primitive'
];

export default Internal.extend({

  store: null,

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  serializersByName: computed(function() {
    let store = this.store;
    return serializers.reduce((hash, name) => {
      let value = this.factoryFor(`zuglet:data/${name}/serializer`).create({ manager: this, store });
      hash[name] = value;
      return hash;
    }, {});
  }).readOnly(),

  serializers: computed(function() {
    return A(Object.values(this.get('serializersByName')));
  }).readOnly(),

  serializerForName(name) {
    return this.get('serializersByName')[name];
  },

  findSerializer(cb) {
    return this.get('serializers').find(cb);
  },

  serializerForPrimitive(value) {
    return this.findSerializer(serializer => serializer.supports(value));
  },

  //

  deserialize(value, type) {
    let internal = toInternal(value);
    if(isInternal(internal)) {
      if(internal.isAttached()) {
        throw new Error('attached internal: not implemented');
      }
    } else {
      let serializer = this.serializerForPrimitive(value);
      internal = serializer.deserialize(value, type);
    }
    return internal;
  },

  //

  createNewInternalObject(...args) {
    let serializer = this.serializerForName('object');
    return serializer.createNewInternal(...args);
  },

  createNewInternalArray(...args) {
    let serializer = this.serializerForName('array');
    return serializer.createNewInternal(...args);
  },

});
