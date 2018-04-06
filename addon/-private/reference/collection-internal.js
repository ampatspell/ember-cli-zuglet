import ReferenceInternal from './reference-internal';
import QueryableInternalMixin from './queryable-internal-mixin';

export default ReferenceInternal.extend(QueryableInternalMixin, {

  createParentInternal(parent) {
    return this.store.createInternalDocumentReferenceForReference(parent);
  },

  createModel() {
    return this.store.factoryFor('zuglet:reference/collection').create({ _internal: this });
  },

  doc(path) {
    let ref;
    if(path) {
      ref = this.ref.doc(path);
    } else {
      ref = this.ref.doc();
    }
    return this.store.createInternalDocumentReferenceForReference(ref);
  }

});
