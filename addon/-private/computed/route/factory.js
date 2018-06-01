import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application'
import { typeOf } from '@ember/utils';

const createModelFactory = arg => {
  let type = typeOf(arg);
  if(type === 'class') {
    return arg;
  } else if(type === 'function') {
    return EmberObject.extend({
      prepare() {
        return arg.call(this, ...arguments);
      }
    });
  }
  return EmberObject.extend(arg);
}

const modelFactoryName = name => `model:${name}`;

const lookupFactory = (owner, name) => {
  let fullName = modelFactoryName(name);
  let factory = owner.factoryFor(fullName);
  assert(`model '${name}' is not registered`, !!factory);
  return factory;
}

const modelNameForRoute = route => {
  let routeName = route.routeName;
  return `route/${routeName.replace(/\./g, '/')}`;
}

export const findOrCreateModelFactory = (route, arg) => {
  let owner = getOwner(route);
  let type = typeOf(arg);

  if(type === 'string') {
    return lookupFactory(owner, arg);
  } else if(type === 'undefined') {
    let normalizedName = modelNameForRoute(route);
    return lookupFactory(owner, normalizedName);
  } else {
    let normalizedName = modelNameForRoute(route);
    let fullName = modelFactoryName(normalizedName);
    let factory = owner.factoryFor(fullName);
    if(!factory) {
      owner.register(fullName, createModelFactory(arg));
      factory = owner.factoryFor(fullName);
    }
    return factory;
  }
}
