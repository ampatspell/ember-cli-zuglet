import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { toInternal, isInternal } from './internal/util';
import { serverTimestamp } from '../util/firestore-types';

const serializers = [
  'reference',
  'timestamp',
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
    let serializers = this.get('serializersByName');
    let values = A();
    for(let key in serializers) {
      values.push(serializers[key]);
    }
    return values;
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

  createInternal(value) {
    if(value === undefined) {
      return;
    }

    let internal = toInternal(value);

    if(isInternal(internal)) {
      if(internal.isAttached()) {
        throw new Error('attached internal: not implemented');
      } else if(internal.root) {
        throw new Error('root internal: not implemented');
      }
    } else {
      let serializer = this.serializerForPrimitive(value);
      internal = serializer.createInternal(value);
    }

    return internal;
  },

  //

  createInternalServerTimestamp() {
    let serializer = this.serializerForName('timestamp');
    return serializer.createInternal(serverTimestamp, 'model');
  },

  createInternalArray(value) {
    let serializer = this.serializerForName('array');
    return serializer.createInternal(value);
  },

  createInternalObject(value) {
    let serializer = this.serializerForName('object');
    return serializer.createInternal(value);
  },

  createInternalRoot(internal) {
    return this.factoryFor('zuglet:data/root').create({ internal });
  },

  createRootInternalObject(value) {
    let internal = this.createInternalObject(value);
    return this.createInternalRoot(internal);
  }

});
