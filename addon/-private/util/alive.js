import { isDestroying } from '@ember/destroyable';

export const alive = () => (target, key, descriptor) => {
  let fn = descriptor.value;
  return {
    value: function(...args) {
      if(isDestroying(this)) {
        return;
      }
      return fn.call(this, ...args);
    }
  };
}
