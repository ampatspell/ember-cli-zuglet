import { consumeKey, dirtyKey } from './tag';

class State {

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

}

export const state = owner => {
  let instance = new State(owner);
  return {
    get() {
      return instance;
    }
  };
}

export const readable = state => (owner, key, descriptor) => {
  return {
    get() {
      return this[state].get(key);
    }
  };
}
