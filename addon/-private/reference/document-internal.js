import ReferenceInternal from './reference-internal';

export default ReferenceInternal.extend({

  createParentInternal(parent) {
    return this.store.createInternalCollectionReferenceForReference(parent);
  },

  createModel() {
    return this.store.factoryFor('zuglet:reference/document').create({ _internal: this });
  },

  collection(path) {
    let ref = this.ref.collection(path);
    return this.store.createInternalCollectionReferenceForReference(ref);
  }

});
