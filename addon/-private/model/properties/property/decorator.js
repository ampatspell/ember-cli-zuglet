import { getOwner } from '../../../util/get-owner';
import { getState } from '../../state';

const {
  assign
} = Object;

export const createProperty = (owner, key, name, opts) => {
  return getState(owner).getProperty(key, state => {
    return getOwner(owner).factoryFor(`zuglet:properties/${name}`).create(assign({ state }, opts));
  });
}
