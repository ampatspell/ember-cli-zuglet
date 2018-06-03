import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import destroyable from '../../util/destroyable';
import containerKey from '../../util/container-key';

const modelName = (owner, key) => {
  owner = containerKey(owner).replace(':', '/');
  return `generated/${owner}/property/${key}`;
}

const get = internal => internal.content(true);

const normalize = (parent, owner, opts, key) => {
  console.log('normalize', opts);
  let name = modelName(parent, key);
  console.log(name);
  return { };
}

const create = opts => {
  return function(key) {
    let owner = getOwner(this);
    let { factory, prepare } = normalize(this, owner, opts, key);
    return owner.factoryFor('zuglet:model/internal').create({ owner: this, factory, prepare });
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
