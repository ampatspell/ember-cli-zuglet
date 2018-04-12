import Internal from '../internal/internal';
import { computed } from '@ember/object';

const serializers = [
  'object'
];

export default Internal.extend({

  store: null,

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  serializers: computed(function() {
    return serializers.reduce((hash, name) => {
      let value = this.factoryFor(`zuglet:data/${name}/serializer`).create({ manager: this });
      hash[name] = value;
      return hash;
    }, {});
  }).readOnly(),

  serializerForName(name) {
    return this.get('serializers')[name];
  },

  createNewInternalObject(...args) {
    let serializer = this.serializerForName('object');
    return serializer.createNewInternal(...args);
  },

});
