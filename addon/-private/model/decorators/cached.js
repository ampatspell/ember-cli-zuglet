import { getState } from '../state';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

export const cached = () => (_, key, descriptor) => {
  return {
    get() {
      let state = getState(this);
      let cache = state.cache[key];
      if(!cache) {
        cache = createCache(() => descriptor.get.call(this))
        state.cache[key] = cache;
      }
      return getValue(cache);
    }
  };
}