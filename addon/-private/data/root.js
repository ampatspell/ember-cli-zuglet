import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  raw: null,
  internal: null,

  isDirty: computed(function() {
    let { raw, internal } = this.getProperties('raw', 'internal');
    return internal.serializer.isDirty(internal, raw);
  }).readOnly(),

  dirtyDidChange() {
    this.notifyPropertyChange('isDirty');
  },

  deserialize(raw) {
    let internal = this.internal;
    internal.serializer.deserialize(internal, raw);
  },

  serialize(type) {
    let internal = this.internal;
    return internal.serializer.serialize(internal, type);
  },

  commit(raw) {
    if(!raw) {
      raw = this.serialize('raw');
    }
    this.set('raw', raw);
    this.dirtyDidChange();
  },

  rollback() {
    let raw = this.get('raw');
    this.deserialize(raw);
  }

});
