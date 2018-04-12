import Serializer from '../internal/serializer';
import { typeOf } from '@ember/utils';

export default Serializer.extend({

  createInternal() {
    return this.factoryFor('zuglet:data/object/internal').create({ serializer: this });
  },

  supports(value) {
    return typeOf(value) === 'object';
  },

  deserialize(values={}, type) {
    let internal = this.createInternal();
    for(let key in values) {
      let value = this.manager.deserialize(values[key], type);
      internal.update(key, value);
    }
    return internal;
  },

  //

  createNewInternal(props) {
    return this.deserialize(props, 'model');
  },

});
