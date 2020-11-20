import firebase from "firebase/app";

import { isArray } from '@ember/array';

let dateTimeFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  seconds: 'numeric',
  timeZoneName: 'short'
});

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

export const isFileList = arg => hasFileList() && arg instanceof FileList;
export const isFile = arg => hasFile() && arg instanceof File;
export const isPromise = arg => arg && isFunction(arg.then);

export const objectToJSON = value => {
  if(typeof value === 'object') {
    if(value === null) {
      return value;
    } else if(isTimestamp(value)) {
      return {
        type: 'timestamp',
        value: dateTimeFormatter.format(value.toDate())
      };
    } else if(isGeoPoint(value)) {
      let json = value.toJSON();
      return {
        type: 'geopoint',
        ...json
      };
    } else if(isFunction(value.toJSON)) {
      return value.toJSON();
    } else if(isArray(value)) {
      return value.map(item => objectToJSON(item));
    } else if(value instanceof Date) {
      return {
        type: 'date',
        value: dateTimeFormatter.format(value)
      };
    } else if(isFile(value)) {
      let { name, type: contentType, size } = value;
      return {
        type: 'file',
        name,
        contentType,
        size
      };
    } else if(isFileList(value)) {
      let files = [ ...value ];
      return files.map(file => objectToJSON(file));
    } else if(isServerTimestamp(value)) {
      return {
        type: 'server-timestamp',
      };
    } else {
      let hash = {};
      Object.getOwnPropertyNames(value).forEach(key => {
        hash[key] = objectToJSON(value[key]);
      });
      return hash;
    }
  }
  return value;
}
