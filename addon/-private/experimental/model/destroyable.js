import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import destroyable from '../../util/destroyable';
import { resolveFactory } from './factory';

const get = internal => internal.model(true);
const reuse = internal => internal.reuse();

const normalize = (parent, opts, key) => {
  let { arg, mapping } = opts;
  let { factory, requiresMapping } = resolveFactory(parent, key, arg);
  assert(`model requires mapping`, !requiresMapping || typeof mapping === 'function');
  return { factory, mapping };
}

const create = opts => {
  return function(key) {
    let { factory, mapping } = normalize(this, opts, key);
    if(!factory) {
      return;
    }
    return getOwner(this).factoryFor('zuglet:computed/model/internal').create({ owner: this, factory, mapping });
  }
}

export default opts => {
  let deps = A(opts.deps).compact();
  assert(`models with dynamic model name cannot be reusable`, !opts.reusable || typeof opts.arg !== 'function');
  let reusable = () => opts.reusable;
  return destroyable(...deps, {
    create: create(opts),
    reusable,
    reuse,
    get,
  });
}
