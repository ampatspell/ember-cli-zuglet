import { objectToJSON } from '../../../util/object-to-json';

const parseKey = key => {
  if(typeof key === 'symbol') {
    return {
      key
    };
  }

  let idx = Number(key);

  if(isNaN(idx)) {
    return {
      key
    };
  }

  return {
    idx
  };
}

const isFunction = arg => typeof arg === 'function';

export const createArrayProxy = instance => new Proxy(instance, {
  get: (target, _key) => {
    let { idx, key } = parseKey(_key);
    if(key) {
      if(isFunction(target[key])) {
        return (...args) => target[key].call(target, ...args);
      }
      return target[key];
    } else {
      return target.atIndex(idx);
    }
  },
  set: (target, _key, value) => {
    let { key } = parseKey(_key);
    if(key) {
      target[key] = value;
      return true;
    }
    return false;
  }
});

export class ArrayProxy {

  constructor(content, activator) {
    this._content = content;
    this._activator = activator;
  }

  //

  atIndex(idx) {
    return this._content[idx];
  }

  atIndex(idx) {
    return this._content[idx];
  }

  get last() {
    return this._content[this._content.length - 1];
  }

  map(...args) {
    return this._content.map(...args);
  }

  forEach(...args) {
    return this._content.forEach(...args);
  }

  reduce(...args) {
    return this._content.reduce(...args);
  }

  find(...args) {
    return this._content.find(...args);
  }

  filter(...args) {
    return this._content.filter(...args);
  }

  get length() {
    return this._content.length;
  }

  get serialized() {
    return this._content.map(object => objectToJSON(object));
  }

}

export default class ArrayActivator {

  type = 'array';

  value = null;
  isActivated = false;

  constructor(property, content) {
    this.property = property;
    this.isActivated = false;
    this.content = content || null;
    this.activate();
  }

  get array() {
    let { _array } = this;
    if(!_array) {
      _array = new ArrayProxy(this.content, this);
      this._array = _array;
    }
    return _array;
  }

  createProxy() {
    let { array } = this;
    return createArrayProxy(array);
  }

  get proxy() {
    let { _proxy } = this;
    if(!_proxy) {
      let { content } = this;
      if(!content) {
        return null;
      }
      _proxy = this.createProxy();
      this._proxy = _proxy;
    }
    return _proxy;
  }

  activate() {
    if(!this.property.isActivated) {
      return;
    }
    let { content } = this;
    console.log('activate', this.property+'', content && content.map(i=>i+""));
  }

  deactivate() {
    let { content } = this;
    console.log('deactivate', this.property+'', content && content.map(i=>i+""));
  }

  getValue() {
    this.activate();
    return this.proxy;
  }

  setValue(value) {
    if(value === this.content) {
      return this.proxy;
    }
    value = value || null;
    // TODO: possibly same models appear in both current and next array
    // should not deactivate & activate needlessly
    this.deactivate();
    this.content = value;
    this._array = null;
    this._proxy = null;
    this.activate();
    return this.proxy;
  }

}
