import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import destroyable from '../../util/destroyable';
import containerKey from '../../util/container-key';

const normalize = (owner, id, opts) => {
  let type = typeOf(opts);
  if(type === 'object') {
    let fullName = `model:generated/${id}`;
    let factory = owner.factoryFor(fullName);
    if(!factory) {
      factory = EmberObject.extend(opts);
      owner.register(fullName, factory);
      factory = owner.factoryFor(fullName);
    }
    return {
      factory
    };
  }
  assert(`inline last argument must be object`, false);
}

const reusable = () => false;

const get = internal => internal.content(true);

const modelId = (owner, key) => {
  owner = containerKey(owner).replace(':', '/');
  return `${owner}/inline/${key}`;
}

const create = arg => function(key) {
  let owner = getOwner(this);
  assert(`inline model works only in instances created by container`, !!owner);
  let id = modelId(this, key);
  let opts = normalize(owner, id, arg);
  return owner.factoryFor('zuglet:computed/object/internal').create({ owner: this, opts });
}

export default (...args) => {
  let opts = args.pop();
  return destroyable(...args, {
    reusable,
    create: create(opts),
    get
  });
};
