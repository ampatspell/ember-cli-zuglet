import Serializer from '../internal/serializer';

export default Serializer.extend({

  createInternal(content) {
    return this.factoryFor('zuglet:data/primitive/internal').create({ manager: this, content });
  }

});
