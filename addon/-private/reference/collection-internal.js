import ReferenceInternal from './reference-internal';

export default ReferenceInternal.extend({

  createParentInternal(parent) {
    return this.store.createInternalDocumentReferenceForReference(parent);
  },

  createModel() {
    return this.store.factoryFor('zuglet:reference/collection').create({ _internal: this });
  }

});