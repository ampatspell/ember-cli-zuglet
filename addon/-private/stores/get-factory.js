import { getStores } from './get-stores';

export const getFactory = (owner, opts) => getStores(owner, opts)?.factory;
