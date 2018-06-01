import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
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

const normalizeRouteName = routeName => `route/${routeName.replace(/\./g, '/')}`;

export const findOrCreateModelFactory = (owner, routeName, arg) => {
  let type = typeOf(arg);
  if(type === 'string') {
    return lookupFactory(owner, arg);
  } else if(type === 'null' || type === 'undefined') {
    let normalizedName = normalizeRouteName(routeName);
    return lookupFactory(owner, normalizedName);
  } else {
    let normalizedName = normalizeRouteName(routeName);
    let fullName = modelFactoryName(normalizedName);
    let factory = owner.factoryFor(fullName);
    if(!factory) {
      owner.register(fullName, createModelFactory(arg));
      factory = owner.factoryFor(fullName);
    }
    return factory;
  }
}
