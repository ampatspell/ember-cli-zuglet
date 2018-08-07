import { assign } from '@ember/polyfills';
import destroyable from './destroyable';

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = destroyable(opts);
  prop.mapping = fn => build(opts, { mapping: fn });
  return prop;
}

export default (...dependencies) => {
  let source = dependencies.shift();
  let factory = dependencies.pop();
  let opts = { source, dependencies, factory };
  return build(opts);
}
