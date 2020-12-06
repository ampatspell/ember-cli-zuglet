import { getStores } from './get-stores';

export const getFactory = owner => getStores(owner).factory;
