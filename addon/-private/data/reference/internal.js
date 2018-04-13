import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content.model(true);
  },

  rollback() {
  },

  checkpoint() {
  },

  update(arg, type) {
    return this.serializer.update(this, arg, type);
  }

});
