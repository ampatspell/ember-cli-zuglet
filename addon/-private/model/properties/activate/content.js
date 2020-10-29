import BaseActivateProperty from './activate';
import { getPath } from '../../../util/get-path';
import { assert } from '@ember/debug';

export default class ContentActivateProperty extends BaseActivateProperty {

  init() {
    super.init(...arguments);
    this.__deps = {};
  }

  get _deps() {
    let owner = this.owner;
    let keys = this.opts.deps;
    let deps = {};
    for(let key of keys) {
      let value = getPath(owner, key);
      deps[key] = value;
    }
    return deps;
  }

  _snapshotDeps() {
    this.__deps = this._deps;
  }

  get _depsChanged() {
    let current = this.__deps;
    let next = this._deps;
    for(let key in next) {
      if(current[key] !== next[key]) {
        return true;
      }
    }
    return false;
  }

  get _value() {
    let value = this.opts.value;
    if(typeof value === 'function') {
      value = value.call(this.owner, this.owner);
    }
    return value;
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      this._snapshotDeps();
      let value = this._value;
      activator = this.createActivator(value);
      this.activator = activator;
    } else if(this._depsChanged) {
      this._snapshotDeps();
      let value = this._value;
      this.assertActivatorType(activator, value);
      activator.setValue(value);
    }
    return activator.getValue();
  }

  setPropertyValue() {
    assert(`@activate().content(...) is read-only`, false);
  }

}
