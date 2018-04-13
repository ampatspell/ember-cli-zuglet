import { isModel } from './model-mixin';
import { isInternal } from './internal';
import { assert } from '@ember/debug';

export const map = (object, cb) => {
  let result = {};
  for(let key in object) {
    let value = cb(key, object[key]);
    if(value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

export const assertIsInternal = (key, value) => {
  assert(`${key} must be internal`, isInternal(value));
};

const toInternal = value => {
  if(isModel(value)) {
    return value._internal;
  }
  return value;
};

const toModel = value => {
  if(isInternal(value)) {
    return value.model(true);
  }
  return value;
}

export {
  isModel,
  isInternal,
  toInternal,
  toModel
};
