import { getOwner } from '../util/get-owner';

export const getStores = owner => getOwner(owner).lookup('zuglet:stores');
