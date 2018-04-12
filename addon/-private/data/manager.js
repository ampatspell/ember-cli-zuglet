import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { A } from '@ember/array';

const serializers = [
  'object',
  'primitive'
];

export default Internal.extend({

  store: null,

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  serializersByName: computed(function() {
    return serializers.reduce((hash, name) => {
      let value = this.factoryFor(`zuglet:data/${name}/serializer`).create({ manager: this });
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

  //

  serializerForPrimitive(value) {
    return this.findSerializer(serializer => serializer.supports(value));
  },

  deserialize(value, type) {
    let serializer = this.serializerForPrimitive(value);
    return serializer.deserialize(value, type);
  },

  //

  createNewInternalObject(...args) {
    let serializer = this.serializerForName('object');
    return serializer.createNewInternal(...args);
  },

});
