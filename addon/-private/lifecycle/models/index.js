import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import property from './property';
import inline from '../util/inline';

const compact = array => A(array).compact();

// foo('docs')
// foo('type', owner => owner.type)
const source = args => {
  args = compact(args);
  if(args.length === 1) {
    return { dependencies: args, key: args[0] };
  } else if(args.length > 1) {
    let last = args[args.length - 1];
    if(typeof last === 'function') {
      let key = args.pop();
      return { dependencies: args, key };
    }
  }
  return undefined;
}

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { parent: compact(args) });
  prop.object = (...args) => build(opts, { object: compact(args) });
  prop.inline = (...args) => build(opts, { inline: inline(args) });
  prop.named = arg => build(opts, { named: arg });
  prop.mapping = arg => build(opts, { mapping: arg });
  prop.source = (...args) => build(opts, { source: source(args) });
  return prop;
}

export default (...args) => {
  let opts = {
    source: undefined,
    parent: [],
    object: [],
    inline: undefined,
    named: undefined,
    mapping: undefined
  };

  return build(opts, {}).source(...args);
}
