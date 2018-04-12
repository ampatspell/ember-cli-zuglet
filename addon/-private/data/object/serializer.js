import Serializer from '../internal/serializer';

export default Serializer.extend({

  createInternal() {
    return this.factoryFor('zuglet:data/object/internal').create({ manager: this });
  },

  createNewInternal(props) {
    return this.createInternal();
  }

});
