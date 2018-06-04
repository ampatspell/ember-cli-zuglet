import EmberObject from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import containerKey from '../../util/container-key';

const generateModelName = (owner, key) => {
  owner = containerKey(owner).replace(':', '/');
  return `generated/${owner}/property/${key}`;
}

const modelFullName = name => `model:${name}`;

const generateModelClassForProperties = props => EmberObject.extend(props);

const resolveObject = (parent, owner, key, arg) => {
  let normalizedName = generateModelName(parent, key);
  let fullName = modelFullName(normalizedName);

  let factory = owner.factoryFor(fullName);
  if(!factory) {
    owner.register(fullName, generateModelClassForProperties(arg));
    factory = owner.factoryFor(fullName);
  }

  return {
    factory,
    requiresMapping: false
  };
}

export const resolveFactory = (parent, owner, key, arg) => {
  let type = typeOf(arg);
  if(type === 'object') {
    return resolveObject(parent, owner, key, arg);
  }
  assert(`model last argument must be object`, false);
}
