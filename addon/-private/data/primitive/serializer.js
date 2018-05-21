import Serializer from '../internal/serializer';

export default Serializer.extend({

  supports() {
    return true;
  },

  matches(internal, value) {
    return typeof internal.content === typeof value;
  },

  createInternal(content) {
    return this.factoryFor('zuglet:data/primitive/internal').create({ serializer: this, content });
  },

  serialize(internal) {
    return internal.content;
  },

  deserialize(internal, value) {
    let replace = internal.content !== value;
    if(replace) {
      internal.content = value;
    }
    return {
      replace,
      internal
    };
  },

  isDirty() {
    return false;
  }

});
