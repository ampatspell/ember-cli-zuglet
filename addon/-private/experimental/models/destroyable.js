import { A } from '@ember/array';
import { assert } from '@ember/debug';
import destroyable from '../../util/destroyable';

const get = internal => internal.model(true);
const reuse = internal => internal.reuse();
const reusable = () => false;

const create = opts => {
  return function(key) {
    // let owner = getOwner(this);
    // let { factory, mapping } = normalize(this, owner, opts, key);
    // if(!factory) {
    //   return;
    // }
    // return owner.factoryFor('zuglet:model/internal').create({ owner: this, factory, mapping });
  }
}

export default opts => {
  let deps = A(opts.deps).compact();
  assert(`models with dynamic model name cannot be reusable`, !opts.reusable || typeof opts.arg !== 'function');
  return destroyable(...deps, {
    create: create(opts),
    reusable,
    reuse,
    get,
  });
}
