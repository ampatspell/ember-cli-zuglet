import Mixin from '@ember/object/mixin';
import { resolve, reject } from 'rsvp';
import { documentMissingError } from '../util/errors';

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
}, {}), {

  query() {
    return this.store.createInternalQueryWithReference(this.ref);
  },

  loadInternal() {
    let ref = this.ref;
    let store = this.store;
    return resolve(ref.get()).then(snapshot => {
      return snapshot.docs.map(doc => store.createInternalDocumentForSnapshot(snapshot));
    });
  },

  load() {
    return this.loadInternal().then(internals => {
      return internals.map(internal => internal.model(true));
    });
  },

  first(opts={}) {
    return this.loadInternal(opts).then(internals => {
      let first = internals[0];
      if(first) {
        return first.model(true);
      }
      if(opts.optional) {
        return;
      }
      return reject(documentMissingError(opts));
    });
  },

});
