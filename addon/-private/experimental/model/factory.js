import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import generateModelClass from '../../util/geneate-model-class';

const resolveObject = (parent, owner, key, arg) => {
  let factory = generateModelClass(parent, key, arg);
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
  assert(`model last argument must be object, string or function`, false);
}
