import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import property from './property';

const compact = array => A(array).compact();

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { parent: compact(args) });
  prop.content = arg => build(opts, { content: arg });
  return prop;
}

export default () => {
  let opts = {
    parent: [],
    content: undefined
  };

  return build(opts, {})
}
