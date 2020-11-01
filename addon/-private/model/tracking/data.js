import { toString } from '../../util/to-string';
import { consumeKey, dirtyKey } from './tag';
import { propToIndex, ARRAY_GETTERS } from './utils';

const KEYS = Symbol();
const ARRAY = Symbol();

class ObjectProxy {
}

class ArrayProxy {
}

const createArrayProxy = (property, target) => {
  return new Proxy(target, {
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
}

const createObjectProxy = (property, target) => {
  return new Proxy(target, {
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
      } else {
        target[prop] = property.wrap(value);
      }
      return true;
    },
    getPrototypeOf() {
      return ObjectProxy.prototype;
    }
  });
}

export default class DataManager {

  constructor(opts={}) {
    this.object = null;
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
    let { proxy } = this;
    if(!proxy) {
      proxy = this.wrap(this.object);
      this.proxy = proxy;
    }
    return proxy;
  }

  setValue(value) {
    dirtyKey(this, 'proxy');
    this.proxy = this.wrap(value);
    return true;
  }

  dirty() {
    dirtyKey(this, 'raw');
    this.delegate.onDirty && this.delegate.onDirty();
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

  toString() {
    return toString(this);
  }

}
