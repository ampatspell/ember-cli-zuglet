import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import destroyable from '../../util/destroyable';

const get = internal => internal.model(true);
const reusable = () => false;

const normalize = (owner, opts, key) => {
  let { dependencies, factory, mapping } = opts;
  return { owner, key, dependencies, factory, mapping };
}

const create = opts => {
  return function(key) {
    let owner = getOwner(this);
    let props = normalize(this, opts, key);
    return owner.factoryFor('zuglet:computed/models/internal').create(props);
  }
}

export default opts => {
  let dependencies = A(opts.dependencies).compact();
  return destroyable(...dependencies, {
    create: create(opts),
    reusable,
    get
  });
}
