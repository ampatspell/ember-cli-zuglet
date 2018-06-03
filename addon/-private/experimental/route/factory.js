import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const normalizeRouteName = routeName => `route/${routeName.replace(/\./g, '/')}`;

const modelFullName = name => `model:${name}`;

const generateModelClassForProperties = props => EmberObject.extend(props);

const resolveObject = (owner, routeName, arg) => {
  let normalizedName = normalizeRouteName(routeName);
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

const factoryFor = (owner, fullName, name) => {
  let factory = owner.factoryFor(fullName);
  assert(`route model '${name}' is not registered`, !!factory);
  return factory;
}

const resolveUndefined = (owner, routeName) => {
  let normalizedName = normalizeRouteName(routeName);
  let fullName = modelFullName(normalizedName);
  let factory = factoryFor(owner, fullName, normalizedName);

  return {
    factory,
    requiresMapping: true
  };
}

const resolveString = (owner, arg) => {
  let fullName = modelFullName(arg);
  let factory = factoryFor(owner, fullName, arg);

  return {
    factory,
    requiresMapping: true
  };
}

export const resolveFactory = (owner, routeName, arg) => {
  let type = typeOf(arg);
  if(type === 'object') {
    return resolveObject(owner, routeName, arg);
  } else if (type === 'undefined') {
    return resolveUndefined(owner, routeName);
  } else if(type === 'string') {
    return resolveString(owner, arg);
  }
  assert(`route model argument must be object, string or undefined`, false);
}
