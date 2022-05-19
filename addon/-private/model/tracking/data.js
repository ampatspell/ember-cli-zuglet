import { toString } from '../../util/to-string';
import { consumeKey, dirtyKey } from './tag';
import { propToIndex, ARRAY_GETTERS } from './utils';
import { A, isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { notifyPropertyChange } from '@ember/object';
import flags from '../../flags';

const PROXY_CLASSIC_SUPPORT = flags.proxyClassicSupport;

if(PROXY_CLASSIC_SUPPORT) {
  // https://github.com/pzuraq/tracked-built-ins/blob/master/addon/-private/object.js
  if (DEBUG) {
    // eslint-disable-next-line no-undef
    let utils = Ember.__loader.require('@ember/-internals/utils')
    let setupMandatorySetter = utils.setupMandatorySetter;
    utils.setupMandatorySetter = (tag, obj, keyName) => {
      if(obj instanceof ObjectProxy) {
        return;
      }
      // TODO: Needs notifyPropertyChange for array ops
      // if(obj instanceof ArrayProxy) {
      //   return;
      // }
      return setupMandatorySetter(tag, obj, keyName);
    }
  }
}

const KEYS = Symbol();
const ARRAY = Symbol();
const UPDATE = Symbol('UPDATE');

class ObjectProxy {
}

class ArrayProxy {
}

const isProxy = arg => arg instanceof ObjectProxy || arg instanceof ArrayProxy;
const updateProxy = (proxy, value) => proxy[UPDATE](value);

const createArrayProxy = (property, target) => {
  let proxy = new Proxy(target, {
    get: (target, prop) => {
      let idx = propToIndex(prop);
      if(idx === null) {
        if(prop === 'length') {
          consumeKey(target, ARRAY);
          return target[prop];
        } else if (ARRAY_GETTERS.has(prop)) {
          return (...args) => {
            consumeKey(target, ARRAY);
            return target[prop].call(target, ...args);
          };
        } else {
          return target[prop];
        }
      } else {
        consumeKey(target, `${idx}`);
        consumeKey(target, ARRAY);
        return target[prop];
      }
    },
    set: (target, prop, value) => {
      let idx = propToIndex(prop);
      if(idx === null) {
        if(prop === 'length') {
          dirtyKey(target, ARRAY);
          property.dirty();
        }
        target[prop] = value;
      } else {
        dirtyKey(target, `${idx}`);
        dirtyKey(target, ARRAY);
        property.dirty();
        target[prop] = property.wrap(value);
      }
      return true;
    },
    getPrototypeOf() {
      return ArrayProxy.prototype;
    }
  });

  let update = (object) => {
    if(!isArray(object)) {
      return false;
    }
    object.forEach((item, idx) => {
      if(isProxy(proxy[idx])) {
        if(!updateProxy(proxy[idx], item)) {
          proxy[idx] = item;
        }
      } else {
        proxy[idx] = item;
      }
    });

    if(proxy.length !== object.length) {
      proxy.length = object.length;
    }

    return true;
  }

  Object.defineProperty(proxy, UPDATE, { value: update });

  return proxy;
}

const createObjectProxy = (property, target) => {
  let proxy = new Proxy(target, {
    get: (target, prop) => {
      consumeKey(target, prop);
      return target[prop];
    },
    has: (target, prop) => {
      consumeKey(target, prop);
      return prop in target;
    },
    ownKeys: (target) => {
      consumeKey(target, KEYS);
      return Reflect.ownKeys(target);
    },
    set: (target, prop, value) => {
      dirtyKey(target, prop);
      dirtyKey(target, KEYS);
      property.dirty();
      if(value === undefined) {
        delete target[prop];
        if(PROXY_CLASSIC_SUPPORT) {
          notifyPropertyChange(proxy, prop);
        }
      } else {
        target[prop] = property.wrap(value);
        if(PROXY_CLASSIC_SUPPORT) {
          notifyPropertyChange(proxy, prop);
        }
      }
      return true;
    },
    deleteProperty(target, prop) {
      if(prop in target) {
        dirtyKey(target, prop);
        dirtyKey(target, KEYS);
        property.dirty();
        delete target[prop];
        if(PROXY_CLASSIC_SUPPORT) {
          notifyPropertyChange(proxy, prop);
        }
      }
      return true;
    },
    getPrototypeOf() {
      return ObjectProxy.prototype;
    }
  });

  let update = (object) => {
    if(typeof object !== 'object' || object === null) {
      return false;
    }
    let remove = A(Object.keys(proxy));
    for(let key in object) {
      let value = object[key];
      if(remove.includes(key)) {
        remove.removeObject(key);
        let current = proxy[key];
        if(current !== value) {
          if(isProxy(proxy[key])) {
            if(!updateProxy(proxy[key], value)) {
              proxy[key] = value;
            }
          } else {
            proxy[key] = value;
          }
        }
      } else {
        proxy[key] = value;
      }
    }
    remove.forEach(key => delete proxy[key]);
    return true;
  }

  Object.defineProperty(proxy, UPDATE, { value: update });

  return proxy;
}

export default class DataManager {

  constructor(opts) {
    assert(`opts must be object`, typeof opts === 'object');
    this.proxy = null;
    this.delegate = opts.delegate; // { onDirty(), shouldExpand(value) }
  }

  shouldExpand(target) {
    let { delegate: { shouldExpand } } = this;
    if(!shouldExpand) {
      return true;
    }
    return shouldExpand(target);
  }

  wrap(target) {
    if(target instanceof ObjectProxy) {
      return target;
    } else if(target instanceof ArrayProxy) {
      return target;
    }

    if(target === undefined) {
      return null;
    } else if(target === null) {
      return null;
    }

    if(typeof target === 'object') {
      if(Array.isArray(target)) {
        let array = target.map(item => this.wrap(item));
        return createArrayProxy(this, array);
      } else if(!this.shouldExpand(target)) {
        return target;
      } else {
        let object = {};
        for(let key in target) {
          object[key] = this.wrap(target[key]);
        }
        return createObjectProxy(this, object);
      }
    } else {
      return target;
    }
  }

  unwrap(source) {
    if(source instanceof ObjectProxy) {
      let target = {};
      for(let key in source) {
        target[key] = this.unwrap(source[key]);
      }
      return target;
    } else if(source instanceof ArrayProxy) {
      return source.map(item => this.unwrap(item));
    } else {
      return source;
    }
  }

  getProxy() {
    consumeKey(this, 'proxy');
    return this.proxy;
  }

  setValue(value) {
    dirtyKey(this, 'proxy');
    this.proxy = this.wrap(value);
    this.dirty();
    return true;
  }

  dirty() {
    dirtyKey(this, 'raw');
    this.delegate.onDirty?.();
  }

  getRaw() {
    consumeKey(this, 'raw');
    consumeKey(this, 'proxy');
    let proxy = this.proxy;
    if(!proxy) {
      return;
    }
    return this.unwrap(proxy);
  }

  update(value) {
    if(!this.proxy || !this.proxy[UPDATE](value)) {
      this.setValue(value);
    }
  }

  toString() {
    return toString(this);
  }

}
