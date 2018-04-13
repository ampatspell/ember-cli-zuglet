import DocumentReference from './document/document';
import InternalDocumentReference from './document/internal';
import CollectionReference from './collection/collection';
import InternalCollectionReference from './collection/internal';

export const isDocumentReference = value => DocumentReference.detectInstance(value);
export const isCollectionReference = value => CollectionReference.detectInstance(value);
export const isDocumentOrCollectionReference = value => isDocumentReference(value) || isCollectionReference(value);

export const isInternalDocumentReference = value => InternalDocumentReference.detectInstance(value);
export const isInternalCollectionReference = value => InternalCollectionReference.detectInstance(value);
export const isInternalDocumentOrCollectionReference = value => isInternalDocumentReference(value) || isInternalCollectionReference(value);

export const toInternalDocumentOrCollectionReference = value => {
  if(isDocumentOrCollectionReference(value)) {
    return value._internal;
  } else if(isInternalDocumentOrCollectionReference(value)) {
    return value;
  }
};
