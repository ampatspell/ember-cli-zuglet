import { setOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { toString } from './util/to-string';
import { isFunction } from './util/object-to-json';

export default class ZugletObject {

  constructor(owner) {
    assert(`owner must be owner object`, owner && isFunction(owner.lookup));
    setOwner(this, owner);
  }

  toString() {
    return toString(this, this.toStringExtension && this.toStringExtension());
  }

}
