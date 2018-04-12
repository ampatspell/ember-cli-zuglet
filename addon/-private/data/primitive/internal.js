import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content;
  },

  update(value) {
    this.set('content', value);
  },

  serialize(type) {
    return this.content;
  }

});
