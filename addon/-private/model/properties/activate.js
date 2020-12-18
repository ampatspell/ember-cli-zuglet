import { property } from './property';
import { isFunction } from '../../util/types';
import { assert } from '@ember/debug';

let getProperty = (owner, key, opts) => property(owner, key, `activate/${opts.type}`, opts);

const define = opts => (_, key) => {
  const get = function() {
    return getProperty(this, key, opts).getPropertyValue();
  };
  if(opts.type === 'content') {
    return {
      get
    };
  } else {
    const set = function(value) {
      return getProperty(this, key, opts).setPropertyValue(value);
    };
    return {
      get,
      set
    };
  }
};

export const activate = () => {

  const opts = {
    type: 'writable'
  };

  const extend = () => {
    const curr = define(opts);
    curr.content = value => {
      assert(`@activate().contnet(fn) must be function not '${value}'`, isFunction(value));
      opts.value = value;
      opts.type = 'content';
      return extend();
    };
    return curr;
  };

  return extend();
};
