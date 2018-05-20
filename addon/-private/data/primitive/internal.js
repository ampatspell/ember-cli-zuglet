import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content;
  },

  serialize() {
    return this.content;
  },

  fetch() {
  },

  _isDirty(internal) {
    if(internal === this) {
      return false;
    }
    if(!this.constructor.detectInstance(internal)) {
      return true;
    }
    return internal.content !== this.content;
  }

});
