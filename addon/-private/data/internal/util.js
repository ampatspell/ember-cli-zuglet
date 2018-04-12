import { isModel } from './model-mixin';
import { isInternal } from './internal';

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
