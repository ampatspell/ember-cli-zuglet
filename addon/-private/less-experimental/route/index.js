import { assign } from '@ember/polyfills';
import property from './property';
import inline from '../util/inline';

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.inline = (...args) => build(opts, { inline: inline(args) });
  prop.named = arg => build(opts, { named: arg });
  prop.mapping = arg => build(opts, { mapping: arg });
  return prop;
}

export default () => {
  let opts = {
    inline: undefined,
    named: undefined,
    mapping: undefined
  };

  return build(opts, {});
}
