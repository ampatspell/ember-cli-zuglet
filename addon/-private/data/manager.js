import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { toInternal, isInternal } from './internal/util';
// import { serverTimestamp } from '../util/firestore-types';

const serializers = [
  // 'reference',
  // 'timestamp',
  // 'array',
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

  createInternal(value, current, commit=false) {
    let internal = toInternal(value);
    if(isInternal(internal)) {
      if(internal.isAttached()) {
        throw new Error('attached internal: not implemented');
      }
    } else {
      let serializer = this.serializerForPrimitive(value);
      let raw = undefined;
      if(commit) {
        raw = value;
      } else if (current && current.serializer === serializer) {
        raw = current.get('raw');
      }
      internal = serializer.createInternal(value, raw);
    }
    return internal;
  },

  //

  // createNewInternalObject(value) {
  //   let serializer = this.serializerForName('object');
  //   return serializer.createInternal(value, 'model');
  // },

  // createNewInternalArray(value) {
  //   let serializer = this.serializerForName('array');
  //   return serializer.createInternal(value, 'model');
  // },

  // createNewInternalServerTimestamp() {
  //   let serializer = this.serializerForName('timestamp');
  //   return serializer.createInternal(serverTimestamp, 'model');
  // }

  createInternalObject(value) {
    let serializer = this.serializerForName('object');
    return serializer.createInternal(value);
  }

});
