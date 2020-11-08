import { getState } from '../state';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { assert } from '@ember/debug';

const {
  keys
} = Object;

/*

class Thing {

  @updated()
  _modelName(curr) {
    let { owner, opts } = this;
    return opts.modelName.call(owner, owner);
  }

  get foo() {
    let { updated, value } = this._modelName;
    if(updated) {
      // reset
    }
    return value;
  }

}

*/

export const asString = (prev, curr) => {
  assert(`value msut be string not ${curr}`, typeof curr === 'string');
  return prev !== curr;
}

export const asObject = (prev, curr) => {
  assert(`value msut be object not ${curr}`, typeof curr === 'object');
  prev = prev || {};
  if(keys(prev).length === keys(curr).length) {
    for(let key in curr) {
      if(prev[key] !== curr[key]) {
        return true;
      }
    }
  }
  return false;
}

export const asIdentity = (prev, curr) => prev !== curr;

export const diff = (diff=asIdentity) => (_, key, descriptor) => {
  return {
    get() {
      let state = getState(this);
      let hash = state.cache[key];
      let previous = hash && hash.value;
      let current;
      if(!hash) {
        let cache = createCache(() => {
          let hash = state.cache[key];
          return descriptor.value.call(this, hash && hash.value);
        });
        current = getValue(cache);
        state.cache[key] = { cache, value: current };
      } else {
        current = getValue(hash.cache);
        hash.value = current;
      }
      let updated = diff(previous, current);
      return {
        updated,
        previous,
        current
      };
    }
  };
}
