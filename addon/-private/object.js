import { setOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { toString } from './util/to-string';
import { isFunction } from './util/types';

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
