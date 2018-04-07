import Mixin from '@ember/object/mixin';
import { reject } from 'rsvp';
import { documentMissingError } from '../../util/errors';
import { A } from '@ember/array';

const formatter = () => ({
  string(info) {
    return `${info.name}(${info.args.join(', ')})`;
  },
  object(info) {
    return {
      type: 'query',
      id: info.name,
      args: info.args
    };
  }
});

const types = {
  'where':      formatter(),
  'orderBy':    formatter(),
  'limit':      formatter(),
  'startAt':    formatter(),
  'startAfter': formatter(),
  'endAt':      formatter(),
  'endBefore':  formatter()
};

export const keys = Object.keys(types);

const query = name => {
  return function(...args) {
    let ref = this.ref;
    let nested = ref[name].call(ref, ...args);
    let formatter = types[name];
    return this.store.createInternalQueryReferenceForReference(nested, this, { name, args, formatter });
  }
}

export default Mixin.create(keys.reduce((hash, key) => {
  hash[key] = query(key);
  return hash;
}, {}), {

  query(opts) {
    return this.store.createInternalQueryWithReference(this, opts);
  },

  didLoad(snapshot) {
    let store = this.store;
    return snapshot.docs.map(doc => store.createInternalDocumentForSnapshot(doc));
  },

  load() {
    return this.get('store.queue').schedule({
      name: 'reference/queryable/load',
      invoke: () => {
        return this.ref.get();
      },
      didResolve: snapshot => {
        let internals = this.didLoad(snapshot);
        return A(internals.map(internal => internal.model(true)));
      },
      didReject: err => reject(err)
    });
  },

  first(opts={}) {
    return this.get('store.queue').schedule({
      name: 'reference/queryable/first',
      invoke: () => {
        return this.ref.get();
      },
      didResolve: snapshot => {
        let internals = this.didLoad(snapshot);
        let first = internals[0];
        if(first) {
          return first.model(true);
        }
        if(opts.optional) {
          return;
        }
        return reject(documentMissingError(opts));
      },
      didReject: err => reject(err)
    });
  },

});
