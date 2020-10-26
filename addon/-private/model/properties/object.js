import Property, { createProperty } from './property';
import DataManager from '../tracking/data';
import { isServerTimestamp, isTimestamp } from '../../util/object-to-json';

export default class ActivateProperty extends Property {

  init() {
    super.init(...arguments);
    this.manager = new DataManager({
      delegate: {
        onDirty: () => this.onDirty(),
        shouldExpand: value => this.shouldExpandValue(value)
      }
    });
  }

  shouldExpandValue(value) {
    if(value instanceof Date) {
      return false;
    } else if(isTimestamp(value)) {
      return false;
    } else if(isServerTimestamp(value)) {
      return false;
    }
    return true;
  }

  onDirty() {
    let onDirty = this.opts.onDirty;
    onDirty && onDirty();
  }

  getRaw() {
    return this.manager.getRaw();
  }

  getPropertyValue() {
    return this.manager.getProxy();
  }

  setPropertyValue(value) {
    return this.manager.setValue(value);
  }

}

let getProperty = (owner, key) => createProperty(owner, key, 'object', {
  opts: {
    onDirty: () => owner._dataDidChange()
  }
});

export const object = () => (_, key) => {
  return {
    get() {
      return getProperty(this, key).getPropertyValue();
    },
    set(value) {
      return getProperty(this, key).setPropertyValue(value);
    }
  };
}

export const raw = objectKey => () => {
  return {
    get() {
      return getProperty(this, objectKey).getRaw();
    }
  };
}
