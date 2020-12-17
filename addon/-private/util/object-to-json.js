import {
  isTimestamp,
  isServerTimestamp,
  isGeoPoint,
  isFunction,
  isArray,
  isDate,
  isFile,
  isFileList
} from './types';

import {
  formatDate
} from './date';

export const objectToJSON = value => {
  if(typeof value === 'object') {
    if(value === null) {
      return value;
    } else if(isTimestamp(value)) {
      return {
        type: 'timestamp',
        value: formatDate(value.toDate())
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
    } else if(isDate(value)) {
      return {
        type: 'date',
        value: formatDate(value)
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
};
