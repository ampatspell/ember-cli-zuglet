import { property } from './property';

let getProperty = (owner, key, opts) => property(owner, key, `activate/${opts.type}`, opts);

const define = opts => (_, key) => {
  return {
    get() {
      return getProperty(this, key, opts).getPropertyValue();
    },
    set(value) {
      return getProperty(this, key, opts).setPropertyValue(value);
    }
  }
}

export const activate = () => {

  let opts = {
    type: 'writable'
  };

  let extend = () => {
    let curr = define(opts);
    curr.content = value => {
      opts.value = value;
      opts.type = 'content';
      return extend();
    }
    return curr;
  }

  return extend();
}
