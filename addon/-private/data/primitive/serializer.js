import Serializer from '../internal/serializer';

export default Serializer.extend({

  supports() {
    return true;
  },

  // matches(internal, value) {
  //   return typeof internal.content === typeof value;
  // },

  createInternal(content) {
    return this.factoryFor('zuglet:data/primitive/internal').create({ serializer: this, content });
  },

  // deserialize(value) {
  //   return this.createInternal(value);
  // },

  // update(internal, value) {
  //   if(internal.content === value) {
  //     return {
  //       replace: false,
  //       internal
  //     };
  //   }

  //   internal = this.createInternal(value);
  //   return {
  //     replace: true,
  //     internal
  //   };
  // }

});
