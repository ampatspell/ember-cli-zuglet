import { assign } from '@ember/polyfills';
import destroyable from './destroyable';

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = destroyable(opts);
  prop.mapping = fn => build(opts, { mapping: fn });
  return prop;
}

export default (...deps) => {
  let arg = deps.pop();
  let opts = { deps, arg };
  return build(opts);
}
