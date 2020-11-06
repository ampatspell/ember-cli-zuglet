import { consumeKey, dirtyKey } from './tag';
import { toString } from '../../util/to-string';

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

  constructor(owner) {
    this._owner = owner;
    this._values = Object.create(null);
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

const marker = Symbol('ZUGLET_STATE');

const getState = owner => {
  let state = owner[marker];
  if(!state) {
    state = new StateProperties(owner);
    owner[marker] = state;
  }
  return state;
}

export const state = () => {
  return {
    get() {
      return getState(this);
    }
  };
}

export const readable = (_, key) => {
  return {
    get() {
      return getState(this).get(key);
    }
  };
}
