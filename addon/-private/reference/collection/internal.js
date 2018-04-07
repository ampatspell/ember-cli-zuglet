import ReferenceInternal from '../internal';
import { readOnly } from '@ember/object/computed';
import QueryableInternalMixin from '../queryable/internal-mixin';

export default ReferenceInternal.extend(QueryableInternalMixin, {

  id: readOnly('ref.id'),
  path: readOnly('ref.path'),

  type: 'collection',

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
    return this.store.createInternalDocumentReferenceForReference(ref, this);
  }

});
