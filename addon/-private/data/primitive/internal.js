import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content;
  },

  serialize() {
    return this.content;
  },

  update(value, type) {
    return this.serializer.update(this, value, type);
  },

  fetch() {
  }

});
