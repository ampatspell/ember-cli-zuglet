import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { assert } from '@ember/debug';

const containerKey = instance => {
  // https://github.com/emberjs/ember.js/issues/10742
  return instance._debugContainerKey;
}

const generateModelName = (owner, key) => {
  owner = containerKey(owner).replace(':', '/');
  let name = `${owner}/property/${key}`;
  if(!owner.startsWith('model/generated')) {
    name = `generated/${name}`;
  }
  return name;
}

const generateModelClassForProperties = props => EmberObject.extend(props);

export const modelFullName = name => `model:${name}`;

export const modelFactoryForShortName = (parent, name) => {
  let fullName = modelFullName(name);
  let factory = getOwner(parent).factoryFor(fullName);
  assert(`model '${name}' is not registered`, !!factory);
  return factory;
}

export const generateModelClass = (parent, key, props) => {
  let normalizedName = generateModelName(parent, key);
  let fullName = modelFullName(normalizedName);
  let owner = getOwner(parent);
  let factory = owner.factoryFor(fullName);
  if(!factory) {
    owner.register(fullName, generateModelClassForProperties(props));
    factory = owner.factoryFor(fullName);
  }
  return factory;
}