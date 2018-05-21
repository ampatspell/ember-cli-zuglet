import Serializer from '../internal/serializer';

export default Serializer.extend({

  supports() {
    return true;
  },

  matches(internal, value) {
    return typeof internal.content === typeof value;
  },

  createInternal(content, raw) {
    return this.factoryFor('zuglet:data/primitive/internal').create({ serializer: this, content, raw });
  },

  serialize(internal) {
    return internal.content;
  },

  deserialize(internal, value, commit) {
    if(internal.content !== value) {
      internal.content = value;
    }

    if(commit) {
      internal.set('raw', value);
    }

    internal.notifyDidUpdate();

    return {
      replace: false,
      internal
    };
  },

  isDirty(internal) {
    let { raw, content } = internal.getProperties('raw', 'content');
    return raw !== content;
  }

});
