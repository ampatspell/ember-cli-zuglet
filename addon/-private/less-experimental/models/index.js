import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import property from './property';

const compact = array => A(array).compact();

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { owner: compact(args) });
  prop.object = (...args) => build(opts, { object: compact(args) });
  prop.inline = arg => build(opts, { inline: arg });
  prop.named = arg => build(opts, { named: arg });
  prop.mapping = arg => build(opts, { mapping: arg });
  return prop;
}

export default source => {
  let opts = {
    source,
    owner: [],
    object: [],
    inline: undefined,
    named: undefined,
    mapping: undefined
  };
  return build(opts);
}
