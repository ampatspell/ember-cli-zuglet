import { getOwner } from '@ember/application';
import destroyable from '../../util/destroyable';
import { assert } from '@ember/debug';

const reusable = () => false;

const get = internal => internal.content(true);

const normalize = (owner, modelName, prepare) => {
  let fullName = `model:${modelName}`;
  let factory = owner.factoryFor(fullName);
  assert(`model '${modelName}' is not registered`, !!factory);
  return {
    factory,
    prepare
  }
}

const create = (modelName, prepare) => function() {
  let owner = getOwner(this);
  assert(`inline model works only in instances created by container`, !!owner);
  let opts = normalize(owner, modelName, prepare);
  return owner.factoryFor('zuglet:computed/object/internal').create({ owner: this, opts });
}

export default (...args) => {
  let prepare = args.pop();
  let modelName = args.pop();
  return destroyable(...args, {
    reusable,
    create: create(modelName, prepare),
    get
  });
}
