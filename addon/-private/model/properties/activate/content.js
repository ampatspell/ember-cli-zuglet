import BaseActivateProperty from './activate';
import { assert } from '@ember/debug';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

export default class ContentActivateProperty extends BaseActivateProperty {

  init() {
    super.init(...arguments);
  }

  get _cache() {
    let cache = this.__cache;
    if(!cache) {
      cache = createCache(() => {
        let { owner, opts: { value } } = this;
        if(typeof value === 'function') {
          return value.call(owner, owner);
        }
        return value;
      });
      this.__cache = cache;
    }
    return cache;
  }

  get _value() {
    return getValue(this._cache);
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      let value = this._value;
      this.value = value;
      activator = this.createActivator(value);
      this.activator = activator;
    } else {
      let value = this._value;
      if(value !== this.value) {
        this.value = value;
        this.assertActivatorType(activator, value);
        activator.setValue(value);
      }
    }
    return activator.getValue();
  }

  setPropertyValue() {
    assert(`@activate().content(...) is read-only`, false);
  }

}
