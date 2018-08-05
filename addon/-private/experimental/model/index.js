import { assign } from '@ember/polyfills';
import destroyable from './destroyable';

const name = args => {
  let factory = args.pop();
  let deps = args;
  if(typeof factory === 'string') {
    let name = factory;
    factory = () => name;
    deps = [];
  }
  return { deps, factory };
}

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = destroyable(opts);
  prop.mapping = fn => build(opts, { mapping: fn });
  prop.reusable = (value=true) => build(opts, { reusable: value });
  prop.named = (...args) => build(opts, { name: name(args) });
  return prop;
}

export default (...deps) => build({ deps });
