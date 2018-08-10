import { assign } from '@ember/polyfills';
import property from './property';

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.inline = arg => build(opts, { inline: arg });
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
