import firebase from 'firebase';

const {
  DocumentReference,
  CollectionReference,
  FieldValue
} = firebase.firestore;

export const isFirestoreDocumentReference = value => value instanceof DocumentReference;
export const isFirestoreCollectionReference = value => value instanceof CollectionReference;

export const isFirestoreDocumentOrCollectionReference = value => {
  return isFirestoreDocumentReference(value) || isFirestoreCollectionReference(value);
};

const serverTimestamp = FieldValue.serverTimestamp();
export const isFirestoreServerTimestamp = value => serverTimestamp.isEqual(value);
