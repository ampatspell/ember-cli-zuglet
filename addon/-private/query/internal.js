import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { join } from '@ember/runloop';
import { resolve, reject } from 'rsvp';
import Internal from '../internal';
import setChangedProperties from '../util/set-changed-properties';
import queue from '../util/queue/computed';
import observers from '../util/observers/computed';

export const state = [ 'isLoading', 'isLoaded', 'isObserving', 'isError', 'error' ];
export const meta = [ 'type', 'size', 'empty', 'metadata' ];

export default Internal.extend({

  store: null,
  query: null,

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

  queue: queue('serialized', 'store.queue'),

  content: null,

  //

  createInternalDocumentForSnapshot(snapshot) {
    return this.get('store').createInternalDocumentForSnapshot(snapshot);
  },

  updateInternalDocumentForSnapshot(internal, snapshot) {
    return this.get('store').updateInternalDocumentForSnapshot(internal, snapshot);
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
  },

  didLoad(snapshot) {
    this._didLoad(snapshot);
    return this;
  },

  loadDidFail(err) {
    setChangedProperties(this, { isLoading: false, isError: true, error: err });
    return reject(err);
  },

  load(opts) {
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading && !opts.force) {
      return resolve(this);
    }

    return this.get('queue').schedule({
      name: 'query/load',
      reuse: operations => operations.findBy('name', 'query/load'),
      invoke: () => {
        this.willLoad();
        let query = this.get('normalizedQuery');
        return query.get();
      },
      didResolve: snapshot => this.didLoad(snapshot),
      didReject: err => this.loadDidFail(err)
    });
  },

  //

  onSnapshot(snapshot) {
    this._didLoad(snapshot);
  },

  _subscribeQueryOnSnapshot() {
    let query = this.get('query');
    let opts = {
      includeDocumentMetadataChanges: true,
      includeQueryMetadataChanges: true
    };
    return query.onSnapshot(opts, snapshot => join(() => this.onSnapshot(snapshot)));
  },

  observers: observers({
    start(state) {
      state._cancel = this._subscribeQueryOnSnapshot();
    },
    stop(state) {
      state._cancel();
    }
  }),

  observe() {
    return this.get('observers').add();
  }

});
