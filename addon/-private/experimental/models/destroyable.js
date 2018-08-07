import { A } from '@ember/array';
import destroyable from '../../util/destroyable';

const get = internal => internal.model(true);
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
  return destroyable(...deps, {
    create: create(opts),
    reusable,
    get,
  });
}
