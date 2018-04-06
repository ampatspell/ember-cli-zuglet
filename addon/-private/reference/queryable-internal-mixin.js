import Mixin from '@ember/object/mixin';

export const keys = [
  'where',
  'orderBy',
  'limit',
  'startAt',
  'startAfter',
  'endAt',
  'endBefore'
];

const query = name => {
  return function(...args) {
    let ref = this.ref;
    let nested = ref[name].call(ref, ...args);
    return this.store.createInternalQueryReferenceForReference(nested);
  }
}

export default Mixin.create(keys.reduce((hash, key) => {
  hash[key] = query(key);
  return hash;
}, {}));
