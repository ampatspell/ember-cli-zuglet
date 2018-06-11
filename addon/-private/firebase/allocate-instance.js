import { getOwner } from '@ember/application';

const getPools = sender => getOwner(sender).factoryFor('zuglet:firebase/pools').class;

export default (sender, identifier, opts) => {
  let pools = getPools(sender);
  let pool = pools.poolForIdentifier(identifier);
  return pool.allocate(sender, opts);
}
