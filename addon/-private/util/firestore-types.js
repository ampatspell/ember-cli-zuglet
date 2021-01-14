import firebase from 'firebase';

const {
  DocumentReference,
  CollectionReference,
  FieldValue,
  Timestamp,
  Blob
} = firebase.firestore;

export const isFirestoreDocumentReference = value => value instanceof DocumentReference;
export const isFirestoreCollectionReference = value => value instanceof CollectionReference;

export const isFirestoreDocumentOrCollectionReference = value => {
  return isFirestoreDocumentReference(value) || isFirestoreCollectionReference(value);
};

export const serverTimestamp = FieldValue.serverTimestamp();
export const isFirestoreServerTimestamp = value => value && serverTimestamp.isEqual(value);

export const isFirestoreTimestamp = value => value instanceof Timestamp;

export const isFirestoreBlob = value => value instanceof Blob;
export const blobFromUint8Array = value => Blob.fromUint8Array(value);
