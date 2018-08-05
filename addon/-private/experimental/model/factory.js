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

const factoryForFullName = (owner, fullName, shortName) => {
  let factory = owner.factoryFor(fullName);
  assert(`model '${shortName}' is not registered`, !!factory);
  return factory;
}

const resolveString = (parent, owner, key, arg) => {
  let fullName = modelFullName(arg);
  let factory = factoryForFullName(owner, fullName, arg);

  return {
    factory,
    requiresMapping: true
  };
}

const resolveFunction = (parent, owner, key, arg) => {
  let name = arg(parent);
  let factory;

  if(name) {
    let fullName = modelFullName(name);
    factory = factoryForFullName(owner, fullName, name);
  }

  return {
    factory,
    requiresMapping: true
  };
}

export const resolveFactory = (parent, owner, key, arg) => {
  let type = typeOf(arg);
  if(type === 'object') {
    return resolveObject(parent, owner, key, arg);
  } else if(type === 'string') {
    return resolveString(parent, owner, key, arg);
  } else if(type === 'function') {
    return resolveFunction(parent, owner, key, arg);
  }
  assert(`model last argument must be object or string`, false);
}
