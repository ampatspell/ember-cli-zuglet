import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  internal: null,
  data: null,

  isDirty: computed(function() {
    return false;
  }).readOnly(),

  serialize(type) {
    let internal = this.internal;
    return internal.serializer.serialize(internal, type);
  },

  commit(data) {
    let internal = this.internal;
    internal.serializer.deserialize(internal, data);
    this.set('data', data);
  },

  rollback() {
    let { data, internal } = this.getProperties('data', 'internal');
    internal.serializer.deserialize(internal, data);
  }

});
