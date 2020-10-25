import { getOwner } from '../../../util/get-owner';
import { computed } from '@ember/object';
import { getState } from '../../state';

const {
  assign
} = Object;

const createProperty = (state, owner, name, props) => {
  return getOwner(owner).factoryFor(`zuglet:properties/${name}`).create(assign({ state }, props));
}

export const property = ({ readOnly, deps, property, opts }) => {

  let getProperty = (owner, key) => {
    return getState(owner).getProperty(key, state => createProperty(state, owner, property, { owner, key, opts }));
  }

  let get = function (key) {
    return getProperty(this, key).getPropertyValue();
  }

  let set;
  if(!readOnly) {
    set = function (key, value) {
      return getProperty(this, key).setPropertyValue(value);
    }
  }

  let decorator = computed(...deps, {
    get,
    set
  });

  if(readOnly) {
    decorator = decorator.readOnly();
  }

  return decorator;
}
