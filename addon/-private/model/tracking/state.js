import { consumeKey, dirtyKey } from './tag';
import { toString } from '../../util/to-string';
import { getState as _getState } from '../state';

//
// class Thing {
//
//   @state _state
//   @readable isNew
//   @readable isLoading
//
//   foo() {
//     // untracked doesn't consume keys
//     let { isNew, isLoading } = this._state.untracked.getProperties('isNew', 'isLoading');
//     this._state.setProperties({ isLoading: true, isNew: false });
//   }
//
// }

class StateProperties {

  constructor(owner, meta) {
    this._owner = owner;
    this._values = Object.create(null);
    this._setup(meta);
  }

  _setup(meta) {
    let { _values } = this;
    for(let key in meta) {
      let { initializer } = meta[key];
      if(initializer) {
        _values[key] = initializer();
      }
    }
  }

  dirty(key) {
    dirtyKey(this._owner, key);
  }

  consume(key) {
    consumeKey(this._owner, key);
  }

  get(key, consume=true) {
    if(consume) {
      this.consume(key);
    }
    return this._values[key];
  }

  set(key, value, dirty=true) {
    this._values[key] = value;
    if(dirty) {
      this.dirty(key);
    }
    return true;
  }

  _getProperties(keys, consume=true) {
    let hash = {};
    for(let key of keys) {
      hash[key] = this.get(key, consume);
    }
    return hash;
  }

  getProperties(...keys) {
    return this._getProperties(keys);
  }

  setProperties(hash, dirty=true) {
    let untracked = this.untracked;
    for(let key in hash) {
      let value = hash[key];
      if(untracked.get(key) !== value) {
        this.set(key, value, dirty);
      }
    }
  }

  get untracked() {
    let untracked = this._untracked;
    if(!untracked) {
      untracked = {
        get: key => this.get(key, false),
        set: (key, value) => this.set(key, value, false),
        getProperties: (...keys) => this._getProperties(keys, false),
        setProperties: hash => this.setProperties(hash, false)
      };
      this._untracked = untracked;
    }
    return untracked;
  }

  toString() {
    return toString(this);
  }

}

const META = new WeakMap();

const getMeta = (prototype, create=true) => {
  let hash = META.get(prototype);
  if(!hash && create) {
    hash = Object.create(null);
    META.set(prototype, hash);
  }
  return hash;
};

const getMetaChain = prototype => {
  let chain = Object.create(null);
  while(prototype) {
    let meta = getMeta(prototype, false);
    if(meta) {
      for(let key in meta) {
        if(!chain[key]) {
          chain[key] = meta[key];
        }
      }
    }
    prototype = prototype.__proto__;
  }
  return chain;
};

const setMeta = (prototype, key, value) => {
  let meta = getMeta(prototype);
  meta[key] = value;
};

const getState = owner => {
  let state = _getState(owner).cache.state;
  if(!state) {
    state = new StateProperties(owner, getMetaChain(owner.constructor.prototype));
    _getState(owner).cache.state = state;
  }
  return state;
};

export const state = () => {
  return {
    get() {
      return getState(this);
    }
  };
};

export const readable = (prototype, key, descriptor) => {
  let { initializer } = descriptor;
  setMeta(prototype, key, { initializer });
  return {
    get() {
      return getState(this).get(key);
    }
  };
};
