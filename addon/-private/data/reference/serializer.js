import Serializer from '../internal/serializer';
// import { assert } from '@ember/debug';
// import {
//   isFirestoreDocumentOrCollectionReference,
//   isFirestoreDocumentReference,
//   isFirestoreCollectionReference
// } from '../../util/firestore-types';
// import {
//   toInternalDocumentOrCollectionReference,
//   isDocumentOrCollectionReference
// } from '../../reference/types';

export default Serializer.extend({

  // supports(value) {
  //   if(isFirestoreDocumentOrCollectionReference(value)) {
  //     return true;
  //   }
  //   if(isDocumentOrCollectionReference(value)) {
  //     return true;
  //   }
  //   return false;
  // },

  // toInternalReference(value) {
  //   if(isFirestoreDocumentReference(value)) {
  //     return this.store.createInternalDocumentReferenceForReference(value);
  //   } else if(isFirestoreCollectionReference(value)) {
  //     return this.store.createInternalCollectionReferenceForReference(value);
  //   }
  //   return toInternalDocumentOrCollectionReference(value);
  // },

  // toFirestoreReference(value) {
  //   if(isFirestoreDocumentOrCollectionReference(value)) {
  //     return value;
  //   }
  //   let internal = toInternalDocumentOrCollectionReference(value);
  //   return internal.ref;
  // },

  // createInternal(value) {
  //   let content = this.toInternalReference(value);
  //   return this.factoryFor('zuglet:data/reference/internal').create({ serializer: this, content });
  // },

  // serialize(internal, type) {
  //   let content = internal.content;
  //   if(type === 'raw') {
  //     return content.get('ref');
  //   } else if(type === 'preview') {
  //     return `reference:${content.get('path')}`;
  //   } else if(type === 'model') {
  //     return content.model(true);
  //   } else {
  //     assert(`unsupported type '${type}'`, false);
  //   }
  // },

  // deserialize(value) {
  //   return this.createInternal(value);
  // },

  // update(internal, value) {
  //   let ref = this.toFirestoreReference(value);
  //   if(internal.content.ref.isEqual(ref)) {
  //     return {
  //       replace: false,
  //       internal
  //     };
  //   }

  //   internal = this.createInternal(value);
  //   return {
  //     replace: true,
  //     internal
  //   };
  // }

});
