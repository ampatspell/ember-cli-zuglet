import { getState } from '../../state';
import { getFactory } from '../../../stores/get-factory';

const createProperty = (state, owner, name, key, opts) => {
  return getFactory(owner).zuglet.create(`properties/${name}`, { state, owner, key, opts });
}

export const property = (owner, key, name, opts) => {
  return getState(owner).getProperty(key, state => createProperty(state, owner, name, key, opts));
}
