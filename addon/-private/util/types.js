import { isArray } from '@ember/array';
import {
  Timestamp,
  serverTimestamp,
  DocumentReference,
  CollectionReference,
  GeoPoint,
  Bytes
} from 'firebase/firestore';

export {
  isArray
}

let _serverTimestamp;
export const isServerTimestamp = arg => {
  if(!_serverTimestamp) {
    _serverTimestamp = serverTimestamp();
  }
  return !!arg && typeof arg === 'object' && _serverTimestamp.isEqual(arg);
};

export const isTimestamp = arg => arg instanceof Timestamp;
export const isDocumentReference = arg => arg instanceof DocumentReference;
export const isCollectionReference = arg => arg instanceof CollectionReference;
export const isGeoPoint = arg => arg instanceof GeoPoint;
export const isFirestoreBlob = arg => arg instanceof Bytes;

export const isFunction = arg => typeof arg === 'function';

const hasFileList = () => ('FileList' in window);
const hasFile = () => ('File' in window);

export const isDate = arg => arg instanceof Date;
export const isFileList = arg => hasFileList() && arg instanceof FileList;
export const isFile = arg => hasFile() && arg instanceof File;
export const isPromise = arg => arg && isFunction(arg.then);
