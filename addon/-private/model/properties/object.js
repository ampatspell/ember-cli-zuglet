import Property, { property, getProperty } from './property';
import Membrane from 'observable-membrane';
import { computed } from '@ember/object';

export default class ActivateProperty extends Property {

  init() {
    super.init(...arguments);
    this.value = {};
  }

  notifyOnChange() {
    let onChange = this.opts.onChange;
    if(onChange) {
      let owner = this.owner;
      onChange.call(owner, owner, this.key);
    }
  }

  valueDidChange() {
    this.notifyOnChange();
    this.notifyPropertyChange();
  }

  get proxy() {
    let proxy = this._proxy;
    if(!proxy) {
      let membrane = new Membrane({
        valueMutated: () => this.valueDidChange()
      });
      proxy = membrane.getProxy(this.value);
      this._proxy = proxy;
    }
    return proxy;
  }

  getPropertyValue() {
    return this.proxy;
  }

  setPropertyValue(value) {
    if(value === this.proxy) {
      return value;
    }
    this._proxy = null;
    this.value = value || {};
    this.notifyOnChange();
    return this.proxy;
  }

}

export const object = (opts={}) => property({
  readOnly: false,
  deps: [],
  property: 'object',
  opts: {
    onChange: opts.onChange
  }
});

export const raw = key => computed(key, {
  get() {
    return getProperty(this, key).value;
  }
}).readOnly();
