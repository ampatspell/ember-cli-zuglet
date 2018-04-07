import Internal from '../util/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { join } from '@ember/runloop';
import { resolve, reject } from 'rsvp';
import setChangedProperties from '../util/set-changed-properties';
import { assertDocumentInternalReference } from '../reference/document/internal';
import observers from '../observers/computed';
import queue from '../queue/computed';

export const state = [ 'isNew', 'isLoading', 'isLoaded', 'isSaving', 'isObserving', 'isError', 'error' ];
export const meta = [ 'exists', 'metadata' ];

export default Internal.extend({

  store: null,
  ref: null,

  init() {
    this._super(...arguments);
    assertDocumentInternalReference('document-internal.ref', this.get('ref'));
  },

  isNew: false,
  isLoading: false,
  isLoaded: false,
  isSaving: false,
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

  queue: queue('serialized', 'store.queue'),

  createModel() {
    return this.store.factoryFor('zuglet:document').create({ _internal: this });
  },

  onNew(data={}) {
    setChangedProperties(this, { isNew: true, data });
  },

  _didLoad(snapshot) {
    let { exists, metadata: _metadata } = snapshot;
    setChangedProperties(this, {
      isNew: false,
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
      console.log('document.onSnapshot', snapshot.ref.path, data);
    } else {
      console.log('document.onSnapshot', snapshot.ref.path, 'missing');
    }

    this._didLoad(snapshot);
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

  load(opts={}) {
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading && !opts.force) {
      return resolve(this);
    }

    return this.get('queue').schedule({
      name: 'document/load',
      reuse: operations => operations.findBy('name', 'document/load'),
      invoke: () => {
        this.willLoad();
        let ref = this.get('ref.ref');
        return ref.get();
      },
      didResolve: snapshot => this.didLoad(snapshot),
      didReject: err => this.loadDidFail(err)
    });
  },

  reload() {
    return this.load({ force: true });
  },

  willSave() {
    setChangedProperties(this, {
      isSaving: true,
      isError: false,
      error: null
    });
  },

  didSave() {
    setChangedProperties(this, {
      isNew: false,
      isSaving: false,
      isLoaded: true,
      exists: true
    });
    return this;
  },

  saveDidFail(err) {
    setChangedProperties(this, { isSaving: false, isError: true, error: err });
    return reject(err);
  },

  save() {
    return this.get('queue').schedule({
      name: 'document/save',
      invoke: () => {
        let ref = this.get('ref.ref');
        let data = this.get('data');
        this.willSave();
        return ref.set(data);
      },
      didResolve: () => this.didSave(),
      didReject: err => this.saveDidFail(err)
    });
  },

  willDelete() {
    setChangedProperties(this, {
      isSaving: true,
      isError: false,
      error: null
    });
  },

  didDelete() {
    setChangedProperties(this, {
      isNew: false,
      isSaving: false,
      isLoaded: true,
      exists: false
    });
    return this;
  },

  deleteDidFail(err) {
    setChangedProperties(this, { isSaving: false, isError: true, error: err });
    return reject(err);
  },

  delete() {
    return this.get('queue').schedule({
      name: 'document/delete',
      invoke: () => {
        let ref = this.get('ref.ref');
        this.willDelete();
        return ref.delete();
      },
      didResolve: () => this.didDelete(),
      didReject: err => this.deleteDidFail(err)
    });
  },

  //

  _subscribeRefOnSnapshot() {
    let ref = this.get('ref.ref');
    return ref.onSnapshot({ includeMetadataChanges: true }, snapshot => join(() => {
      if(this.isDestroying) {
        return;
      }
      this.onSnapshot(snapshot);
    }));
  },

  observers: observers({
    parent: 'store',
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
