import { getState } from '../state';

export const cached = () => (_, key, descriptor) => {
  return {
    get() {
      let state = getState(this);
      let value = state.cache[key];
      if(!value) {
        value = descriptor.get.call(this);
        state.cache[key] = value;
      }
      return value;
    }
  };
}
