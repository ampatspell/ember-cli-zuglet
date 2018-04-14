import firebase from 'firebase';

const {
  DocumentReference,
  CollectionReference
} = firebase.firestore;

export const isFirestoreDocumentReference = value => value instanceof DocumentReference;
export const isFirestoreCollectionReference = value => value instanceof CollectionReference;

export const isFirestoreDocumentOrCollectionReference = value => isFirestoreDocumentReference(value) || isFirestoreCollectionReference(value);

export const isFirestoreServerTimestamp = value => {
  return value && value.methodName === 'FieldValue.serverTimestamp()';
};
