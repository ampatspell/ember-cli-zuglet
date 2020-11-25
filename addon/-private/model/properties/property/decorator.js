import { getOwner } from '../../../util/get-owner';
import { getState } from '../../state';

const createProperty = (state, owner, name, key, opts) => {
  return getOwner(owner).factoryFor(`zuglet:properties/${name}`).create({ state, owner, key, opts });
}

export const property = (owner, key, name, opts) => {
  return getState(owner).getProperty(key, state => createProperty(state, owner, name, key, opts));
}
