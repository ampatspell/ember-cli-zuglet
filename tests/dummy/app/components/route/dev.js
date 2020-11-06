import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { getOwner, setOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { consumeKey, dirtyKey } from 'zuglet/-private/model/tracking/tag';

const {
  assign
} = Object;

class State {

  constructor(owner, defaults) {
    this._owner = owner;
    this._values = assign({}, defaults);
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
        this.set(key, valye, dirty);
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

class Thing {

  constructor(owner) {
    setOwner(this, owner);
    this._state = new State(owner, { isNew: false, isLoading: false });
  }

  get isNew() {
    return this._state.get('isNew');
  }

  set isNew(value) {
    return this._state.set('isNew', value);
  }

  get isLoading() {
    return this._state.get('isLoading');
  }

  set isLoading(value) {
    return this._state.set('isLoading', value);
  }

  onActivated() {
    let { isNew, isLoading } = this._state.untracked.getProperties('isNew', 'isLoading');
    this.isLoading = true;
  }

  get serialized() {
    let { isNew, isLoading } = this;
    return { isNew, isLoading };
  }

  toJSON() {
    return { serialized: this.serialized }
  }

  toString() {
    return toString(this);
  }

}


@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @activate().content(owner => new Thing(getOwner(owner)))
  thing

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
