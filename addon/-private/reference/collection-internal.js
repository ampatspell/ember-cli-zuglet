import { computed } from '@ember/object';
import Internal from '../internal';

export default Internal.extend({

  store: null,
  ref: null,

  parent: computed(function() {
    let parent = this.ref.parent;
    if(!parent) {
      return null;
    }
    return this.store.createInternalDocumentReferenceForReference(parent);
  }),

  createModel() {
    return this.store.factoryFor('zuglet:reference/collection').create({ _internal: this });
  }

});