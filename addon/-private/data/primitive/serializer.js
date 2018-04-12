import Serializer from '../internal/serializer';

export default Serializer.extend({

  supports(value) {
    return true;
  },

  createInternal() {
    return this.factoryFor('zuglet:data/primitive/internal').create({ serializer: this });
  },

  deserialize(value, type) {
    let internal = this.createInternal();
    internal.update(value);
    return internal;
  }

});
