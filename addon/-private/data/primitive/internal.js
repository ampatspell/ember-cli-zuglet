import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content;
  },

  serialize() {
    return this.content;
  },

  rollback() {
  },

  checkpoint() {
  },

  update(arg, type) {
    return this.serializer.update(this, arg, type);
  }

});
