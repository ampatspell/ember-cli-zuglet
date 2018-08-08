import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import containerKey from './container-key';
import modelFullName from './model-full-name';

const generateModelClassForProperties = props => EmberObject.extend(props);

const generateModelName = (owner, key) => {
  owner = containerKey(owner).replace(':', '/');
  let name = `${owner}/property/${key}`;
  if(!owner.startsWith('model/generated')) {
    name = `generated/${name}`;
  }
  return name;
}

export default (parent, key, props) => {
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
