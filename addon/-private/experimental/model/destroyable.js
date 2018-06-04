import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import destroyable from '../../util/destroyable';
import { resolveFactory } from './factory';

const get = internal => internal.model(true);

const normalize = (parent, owner, opts, key) => {
  let { arg, mapping } = opts;
  let { factory, requiresMapping } = resolveFactory(parent, owner, key, arg);
  assert(`model requires mapping`, !requiresMapping || typeof mapping === 'function');
  return { factory, mapping };
}

const create = opts => {
  return function(key) {
    let owner = getOwner(this);
    let { factory, mapping } = normalize(this, owner, opts, key);
    return owner.factoryFor('zuglet:model/internal').create({ owner: this, factory, mapping });
  }
}

export default opts => {
  let deps = A(opts.deps).compact();
  let reusable = () => opts.reusable;
  return destroyable(...deps, {
    create: create(opts),
    reusable,
    get,
  });
}
