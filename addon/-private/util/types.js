import firebase from "firebase/app";
import { isArray } from '@ember/array';

export {
  isArray
}

let _serverTimestamp;
export const isServerTimestamp = arg => {
  if(!_serverTimestamp) {
    _serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
  }
  return typeof arg === 'object' && _serverTimestamp.isEqual(arg);
}

export const isTimestamp = arg => arg instanceof firebase.firestore.Timestamp;
export const isDocumentReference = arg => arg instanceof firebase.firestore.DocumentReference;
export const isCollectionReference = arg => arg instanceof firebase.firestore.CollectionReference;
export const isGeoPoint = arg => arg instanceof firebase.firestore.GeoPoint;

export const isFunction = arg => typeof arg === 'function';

const hasFileList = () => ('FileList' in window);
const hasFile = () => ('File' in window);

export const isDate = arg => arg instanceof Date;
export const isFileList = arg => hasFileList() && arg instanceof FileList;
export const isFile = arg => hasFile() && arg instanceof File;
export const isPromise = arg => arg && isFunction(arg.then);
