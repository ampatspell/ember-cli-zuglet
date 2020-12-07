import { getOwner } from '../util/get-owner';

export const getStores = (owner, opts) => getOwner(owner, opts)?.lookup('zuglet:stores');
