import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import property from './property';
import inline from '../util/inline';

const compact = array => A(array).compact();

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { parent: compact(args) });
  prop.inline = (...args) => build(opts, { inline: inline(args) });
  prop.named = arg => build(opts, { named: arg });
  prop.mapping = arg => build(opts, { mapping: arg });
  return prop;
}

export default () => {
  let opts = {
    parent: [],
    object: [],
    inline: undefined,
    named: undefined,
    mapping: undefined
  };

  return build(opts, {});
}
