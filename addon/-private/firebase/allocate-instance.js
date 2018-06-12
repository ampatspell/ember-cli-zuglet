import { getOwner } from '@ember/application';

const getPools = sender => getOwner(sender).factoryFor('zuglet:firebase/pools').class;
const getPool = (sender, identifier) => getPools(sender).poolForIdentifier(identifier);

export default (sender, identifier, opts) => getPool(sender, identifier).allocate(sender, opts);
