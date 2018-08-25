import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { modelClassForName, createModelClassFromProperties } from '../../lifecycle/util/model-factory';

const resolveObject = (parent, key, arg) => {
  let factory = createModelClassFromProperties(parent, key, arg, []);
  return {
    factory,
    requiresMapping: false
  };
}

const resolveString = (parent, arg) => {
  let factory = modelClassForName(parent, arg);

  return {
    factory,
    requiresMapping: true
  };
}

const resolveFunction = (parent, arg) => {
  let name = arg(parent);
  let factory;

  if(name) {
    factory = modelClassForName(parent, name);
  }

  return {
    factory,
    requiresMapping: true
  };
}

export const resolveFactory = (parent, key, arg) => {
  let type = typeOf(arg);
  if(type === 'object') {
    return resolveObject(parent, key, arg);
  } else if(type === 'string') {
    return resolveString(parent, arg);
  } else if(type === 'function') {
    return resolveFunction(parent, arg);
  }
  assert(`model last argument must be object, string or function`, false);
}
