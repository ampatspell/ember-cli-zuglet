import { getOwner } from '../util/get-owner';

export const getFactory = (owner, opts) => getOwner(owner, opts)?.lookup('zuglet:factory');
