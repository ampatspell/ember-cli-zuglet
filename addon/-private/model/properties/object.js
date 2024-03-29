import Property, { property } from './property';
import { getState } from '../state';
import DataManager from '../tracking/data';
import { assert } from '@ember/debug';
import {
  isDate,
  isServerTimestamp,
  isTimestamp,
  isFunction,
  isDocumentReference,
  isGeoPoint,
  isFirestoreBlob
} from '../../util/types';

export default class ObjectProperty extends Property {

  constructor() {
    super(...arguments);
    this.manager = new DataManager({
      delegate: {
        onDirty: () => this.onDirty(),
        shouldExpand: value => this.shouldExpandValue(value)
      }
    });
  }

  shouldExpandValue(value) {
    if(isDate(value)) {
      return false;
    } else if(isTimestamp(value)) {
      return false;
    } else if(isServerTimestamp(value)) {
      return false;
    } else if(isDocumentReference(value)) {
      return false;
    } else if(isGeoPoint(value)) {
      return false;
    } else if(isFirestoreBlob(value)) {
      return false;
    }
    return true;
  }

  onDirty() {
    let { owner, opts: { onDirty } } = this;
    onDirty?.call(owner, owner);
  }

  getRaw() {
    return this.manager.getRaw();
  }

  update(value) {
    return this.manager.update(value);
  }

  getPropertyValue() {
    return this.manager.getProxy();
  }

  setPropertyValue(value) {
    return this.manager.setValue(value);
  }

}

const getProperty = (owner, key, opts) => property(owner, key, 'object', opts);

const define = (opts) => (_, key) => {
  return {
    get() {
      return getProperty(this, key, opts).getPropertyValue();
    },
    set(value) {
      return getProperty(this, key, opts).setPropertyValue(value);
    }
  };
}

export const object = () => {

  let opts = {
    onDirty: null
  };

  let extend = () => {
    let curr = define(opts);
    curr.onDirty = fn => {
      assert(`@object().onDirty(fn) must be function not '${fn}'`, isFunction(fn));
      opts.onDirty = fn;
      return extend();
    }
    return curr;
  }

  return extend();
}

export const raw = objectKey => () => {
  return {
    get() {
      let property = getState(this).getProperty(objectKey);
      if(!property) {
        return;
      }
      return property.getRaw();
    }
  };
}

export const update = (objectKey) => () => {
  return {
    value: function(object) {
      let property = getState(this).getProperty(objectKey);
      if(!property) {
        return;
      }
      return property.update(object);
    }
  }
}
