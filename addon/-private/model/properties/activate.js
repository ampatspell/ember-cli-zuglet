import { property } from './property';

let getProperty = (owner, key, opts) => property(owner, key, `activate/${opts.type}`, opts);

const define = opts => (_, key) => {
  let get = function() {
    return getProperty(this, key, opts).getPropertyValue();
  }
  if(opts.type === 'content') {
    return {
      get
    };
  } else {
    let set = function(value) {
      return getProperty(this, key, opts).setPropertyValue(value);
    }
    return {
      get,
      set
    };
  }
}

export const activate = () => {

  let opts = {
    type: 'writable'
  };

  let extend = () => {
    let curr = define(opts);
    curr.content = value => {
      if(typeof value === 'function') {
        opts.value = value;
      } else {
        opts.value = () => value;
      }
      opts.type = 'content';
      return extend();
    }
    return curr;
  }

  return extend();
}
