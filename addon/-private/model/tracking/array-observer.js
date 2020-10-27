import { toString } from '../../util/to-string';
import { consumeKey, dirtyKey } from './tag';
import { propToIndex, ARRAY_GETTERS } from './utils';

const ARRAY = Symbol();

class ArrayObserverProxy {
}

const createProxy = (manager, _target) => new Proxy(_target, {
  get(target, prop) {
    let idx = propToIndex(prop);
    if(idx === null) {
      if(prop === 'length') {
        consumeKey(target, ARRAY);
        return target[prop];
      } else if (ARRAY_GETTERS.has(prop)) {
        return (...args) => {
          // consumeKey(target, ARRAY);
          dirtyKey(target, ARRAY);
          console.log('fn', prop);
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
  set(target, prop, value) {
    console.log('set', prop, value);
    let idx = propToIndex(prop);
    if(idx === null) {
      if(prop === 'length') {
        dirtyKey(target, ARRAY);
      }
      target[prop] = value;
    } else {
      dirtyKey(target, `${idx}`);
      dirtyKey(target, ARRAY);

      let current = target[prop];
      if(current !== value) {
        console.log('replace', current, value);
      }
      target[prop] = value;
    }
    return true;
  },
  getPrototypeOf() {
    return ArrayObserverProxy.prototype;
  }
});

export default class ArrayObserver {

  constructor(content) {
    this.content = content;
    this._proxy = null;
  }

  get proxy() {
    let proxy = this._proxy;
    if(!proxy) {
      proxy = createProxy(this, this.content);
      this._proxy = proxy;
    }
    return proxy;
  }

  toString() {
    return toString(this);
  }

}
