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

export const isFunction = arg => typeof arg === 'function';

export const isFileList = arg => arg instanceof FileList;
export const isFile = arg => arg instanceof File;
export const isPromise = arg => arg && isFunction(arg.then);

export const objectToJSON = value => {
  if(typeof value === 'object') {
    let serialized;
    if(value === null) {
      return value;
    } else if(serialized = value.serialized) {
      return serialized;
    } else if(isArray(value)) {
      return value.map(item => objectToJSON(item));
    } else if(value instanceof Date) {
      return {
        type: 'date',
        value: dateTimeFormatter.format(value)
      };
    } else if(isFile(value)) {
      let { name, type, size } = value;
      return {
        type: 'file',
        name,
        type,
        size
      };
    } else if(isFileList(value)) {
      let files = [ ...value ];
      return files.map(file => objectToJSON(file));
    } else if(isTimestamp(value)) {
      return {
        type: 'timestamp',
        value: dateTimeFormatter.format(value.toDate())
      };
    } else if(isServerTimestamp(value)) {
      return {
        type: 'server-timestamp',
      };
    } else if(isFunction(value.toJSON)) {
      return value.toJSON();
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
