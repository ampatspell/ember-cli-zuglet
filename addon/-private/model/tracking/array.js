import { toString } from '../../util/to-string';
import { consumeKey, dirtyKey } from './tag';
import { propToIndex, ARRAY_GETTERS, ARRAY_MUTATORS } from './utils';

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
          consumeKey(target, ARRAY);
          return target[prop].call(target, ...args);
        };
      } else {
        if(prop === 'pop') {
          return () => {
            dirtyKey(target, ARRAY);
            let item = target.pop();
            manager.onItemRemoved(item);
            return item;
          };
        } else if(prop === 'shift') {
          return () => {
            dirtyKey(target, ARRAY);
            let item = target.shift();
            manager.onItemRemoved(item);
            return item;
          };
        } else if(prop === 'push') {
          return (...items) => {
            manager.onItemsAdded(items);
            dirtyKey(target, ARRAY);
            return target.push(...items);
          };
        } else if(prop === 'unshift') {
          return (...items) => {
            manager.onItemsAdded(items);
            dirtyKey(target, ARRAY);
            return target.unshift(...items);
          };
        } else if(prop === 'splice') {
          return (start, deleteCount, ...adding) => {
            dirtyKey(target, ARRAY);
            let removed = target.splice(start, deleteCount, ...adding);
            manager.onItemsAdded(adding);
            manager.onItemsRemoved(removed);
            return removed;
          };
        } else if(prop === 'replace') {
          return (start, deleteCount, items) => {
            dirtyKey(target, ARRAY);
            let removed = target.replace(start, deleteCount, items);
            manager.onItemsAdded(items);
            manager.onItemsRemoved(removed);
            return removed;
          };
        } else if(ARRAY_MUTATORS.has(prop)) {
          throw new Error(`Array mutator ${prop} is not supported`);
        }
        return target[prop];
      }
    } else {
      consumeKey(target, `${idx}`);
      consumeKey(target, ARRAY);
      return target[prop];
    }
  },
  set(target, prop, value) {
    let idx = propToIndex(prop);
    if(idx === null) {
      if(prop === 'length') {
        let items = target.slice(value, target.length);
        manager.onItemsRemoved(items);
        dirtyKey(target, ARRAY);
      }
      target[prop] = value;
    } else {
      dirtyKey(target, `${idx}`);
      dirtyKey(target, ARRAY);
      let current = target[prop];
      if(current !== value) {
        manager.onItemAdded(value);
        manager.onItemRemoved(current);
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

  constructor({ content, delegate }) {
    this.content = content;
    this.delegate = delegate;
    this._proxy = null;
  }

  onItemAdded(item) {
    this.delegate.onAdd(item);
  }

  onItemRemoved(item) {
    this.delegate.onRemove(item);
  }

  onItemsAdded(items) {
    items.forEach(item => this.onItemAdded(item));
  }

  onItemsRemoved(items) {
    items.forEach(item => this.onItemRemoved(item));
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
