import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { join } from '@ember/runloop';
import { reject } from 'rsvp';
import Internal from './internal';
import setChangedProperties from './util/set-changed-properties';
import task from './task/computed';
import { observers } from './util/observers';

export const state = [ 'isLoading', 'isLoaded', 'isObserving', 'isError', 'error' ];
export const meta = [ 'exists', 'metadata' ];

export default Internal.extend({

  store: null,
  ref: null,

  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null,

  isObserving: readOnly('observers.isEnabled'),

  exists: undefined,
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

  createModel() {
    return this.store.factoryFor('zuglet:document').create({ _internal: this });
  },

  _didLoad(snapshot) {
    let { exists, metadata: _metadata } = snapshot;
    setChangedProperties(this, {
      isLoading: false,
      isLoaded: true,
      isError: false,
      error: null,
      exists,
      _metadata
    });
  },

  onSnapshot(snapshot) {
    if(snapshot.exists) {
      let data = snapshot.data({ serverTimestamps: 'estimate' });
      this.set('data', data);
      console.log(snapshot.ref.path, data);
    } else {
      console.log(snapshot.ref.path, 'exists=false');
    }

    this._didLoad(snapshot, data);
  },

  //

  willLoad() {
    setChangedProperties(this, {
      isLoading: true,
      isError: false,
      error: null
    });
  },

  didLoad(snapshot) {
    this.onSnapshot(snapshot);
    return this;
  },

  loadDidFail(err) {
    setChangedProperties(this, { isLoading: false, isError: true, error: err });
    return reject(err);
  },

  _load() {
    this.willLoad();
    let ref = this.get('ref');
    return ref.get();
  },

  loadTask: task('serialized', {
    perform() {
      return this._load();
    },
    didResolve(snapshot) {
      return this.didLoad(snapshot);
    },
    didReject(err) {
      return this.loadDidFail(err);
    }
  }),

  load() {
    return this.get('loadTask.promise');
  },

  //

  _subscribeRefOnSnapshot() {
    let ref = this.get('ref');
    return ref.onSnapshot({ includeMetadataChanges: true }, snapshot => join(() => this.onSnapshot(snapshot)));
  },

  observers: observers({
    start(state) {
      state._cancel = this._subscribeRefOnSnapshot();
    },
    stop(state) {
      state._cancel();
    }
  }),

  observe() {
    return this.get('observers').add();
  }

});