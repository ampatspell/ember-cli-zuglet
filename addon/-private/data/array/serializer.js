import Serializer from '../internal/serializer';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default Serializer.extend({

  createInternal() {
    return this.factoryFor('zuglet:data/array/internal').create({ serializer: this });
  },

  supports(value) {
    return typeOf(value) === 'array';
  },

  deserialize(values, type) {
    let internal = this.createInternal();
    let manager = this.manager;
    let internals = A(values).map(value => manager.deserialize(value, type));
    internal.replace(0, 0, internals);
    return internal;
  },

  //

  createNewInternal(props) {
    let internal = this.deserialize(props, 'model');
    internal.checkpoint();
    return internal;
  }

});
