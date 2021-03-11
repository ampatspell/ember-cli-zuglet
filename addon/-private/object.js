import { setOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { toString } from './util/to-string';
import { isFunction } from './util/types';

export const setProperties = (object, hash, diff=true) => {
  for(let key in hash) {
    let value = hash[key];
    if(diff && object[key] === value) {
      continue;
    }
    object[key] = value;
  }
};

export default class ZugletObject {

  constructor(owner) {
    assert(`owner must be owner object`, owner && isFunction(owner.lookup));
    setOwner(this, owner);
  }

  toString() {
    let extension;
    if(isFunction(this.toStringExtension)) {
      extension = this.toStringExtension();
    }
    return toString(this, extension);
  }

}
