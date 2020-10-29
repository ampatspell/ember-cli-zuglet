export const alive = () => (target, key, descriptor) => {
  let fn = descriptor.value;
  return {
    value: function(...args) {
      if(this.isDestroying) {
        return;
      }
      return fn.call(this, ...args);
    }
  };
}
