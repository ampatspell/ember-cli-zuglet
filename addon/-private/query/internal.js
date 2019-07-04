import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { resolve, reject } from 'rsvp';
import setChangedProperties from '../util/set-changed-properties';
import queue from '../queue/computed';
import observers from '../observers/computed';
import actions from '../util/actions';

export const state = [ 'isLoading', 'isLoaded', 'isObserving', 'isError', 'error' ];
export const meta = [ 'type', 'size', 'empty', 'metadata' ];

export default Internal.extend({

  store: null,
  query: null,
  opts: null, // { doc }

  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null,

  isObserving: readOnly('observers.isEnabled'),

  size: undefined,
  empty: undefined,
  _metadata: undefined,

  metadata: computed('_metadata', function() {
    let metadata = this.get('_metadata');
    if(!metadata) {
      return;
    }
    return {
      fromCache: metadata.fromCache,
      hasPendingWrites: metadata.hasPendingWrites
    };
  }).readOnly(),

  normalizedQuery: readOnly('query'),

  unwrappedQuery: computed('normalizedQuery', function() {
    return this.get('normalizedQuery').ref;
  }).readOnly(),

  queue: queue('serialized', 'store.queue'),

  content: null,

  //

  reuseableInternalDocumentForSnapshot(snapshot) {
    let doc = this.get('opts.doc');
    if(doc) {
      let model = doc(snapshot.ref.path);
      if(model) {
        return model._internal;
      }
    }
  },

  createInternalDocumentForSnapshot(snapshot) {
    let internal = this.reuseableInternalDocumentForSnapshot(snapshot);
    if(internal) {
      return this.updateInternalDocumentForSnapshot(internal, snapshot);
    }
    return this.get('store').createInternalDocumentForSnapshot(snapshot);
  },

  updateInternalDocumentForSnapshot(internal, snapshot) {
    return this.get('store').updateInternalDocumentForSnapshot(internal, snapshot);
  },

  factoryFor(name) {
    return this.get('store').factoryFor(name);
  },

  //

  willLoad() {
    setChangedProperties(this, {
      isLoading: true,
      isError: false,
      error: null
    });
  },

  _didLoad(snapshot) {
    let { size, metadata, empty } = snapshot;
    setChangedProperties(this, { isLoading: false, isLoaded: true, size, empty, _metadata: metadata });
    this.resolveObservers();
  },

  didLoad(snapshot) {
    this._didLoad(snapshot);
    return this;
  },

  loadDidFail(err) {
    setChangedProperties(this, { isLoading: false, isError: true, error: err });
    return reject(err);
  },

  load(opts={}) {
    let { force, source } = opts;
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading && !force) {
      return resolve(this);
    }

    return this.get('queue').schedule({
      name: 'query/load',
      reuse: operations => operations.findBy('name', 'query/load'),
      invoke: () => {
        this.willLoad();
        let query = this.get('unwrappedQuery');
        return query.get({ source });
      },
      didResolve: snapshot => this.didLoad(snapshot),
      didReject: err => this.loadDidFail(err)
    });
  },

  reload(opts={}) {
    return this.load(assign({ force: true }, opts));
  },

  //

  onSnapshot(snapshot) {
    this._didLoad(snapshot);
  },

  subscribeQueryOnSnapshot() {
    let query = this.get('unwrappedQuery');
    let opts = { includeMetadataChanges: true };
    return query.onSnapshot(opts, snapshot => actions(() => {
      if(this.isDestroying) {
        return;
      }
      this.onSnapshot(snapshot);
    }), err => {
      let string = this.get('normalizedQuery.string');
      console.error(`query '${string}' onSnapshot`, err);
    });
  },

  willObserve() {
    let { isLoading, isLoaded } = this.getProperties('isLoading', 'isLoaded');
    if(!isLoaded && !isLoading) {
      this.set('isLoading', true);
    }
  },

  observers: observers({
    parent: 'store',
    start(state) {
      this.willObserve();
      state._cancel = this.subscribeQueryOnSnapshot();
    },
    stop(state) {
      state._cancel();
    }
  }),

  resolveObservers() {
    this.get('observers').resolve(this.model(true));
  },

  observe() {
    let store = this.get('store');
    let query = this;
    return this.get('observers').add('zuglet:observer/query/internal', { store, query });
  }

});
