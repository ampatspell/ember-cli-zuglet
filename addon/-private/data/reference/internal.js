import Internal from '../internal/internal';

export default Internal.extend({

  content: null,

  model() {
    return this.content.model(true);
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
    return internal.content.get('path') !== this.content.get('path');
  }

});
