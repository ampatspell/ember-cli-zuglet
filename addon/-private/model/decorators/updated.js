import { getState } from '../state';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

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

export const updated = () => (_, key, descriptor) => {
  return {
    get() {
      let state = getState(this);
      let hash = state.cache[key];
      let value;
      let updated;
      if(!hash) {
        let cache = createCache(() => {
          let hash = state.cache[key];
          return descriptor.value.call(this, hash && hash.value);
        });
        value = getValue(cache);
        updated = true;
        state.cache[key] = { cache, value };
      } else {
        value = getValue(hash.cache);
        updated = hash.value !== value;
        hash.value = value;
      }
      return {
        updated,
        value
      };
    }
  };
}
