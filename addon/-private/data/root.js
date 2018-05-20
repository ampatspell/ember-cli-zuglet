import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  internal: null,

  isDirty: computed(function() {
    return false;
  }).readOnly(),

  serialize(type) {
    let internal = this.internal;
    return internal.serializer.serialize(internal, type);
  },

  commit(raw) {
  },

  rollback() {
  }

});
