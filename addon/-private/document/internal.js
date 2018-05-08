import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { resolve, reject } from 'rsvp';
import setChangedProperties from '../util/set-changed-properties';
import { assertDocumentInternalReference } from '../reference/document/internal';
import observers from '../observers/computed';
import queue from '../queue/computed';
import actions from '../util/actions';

export const state = [ 'isNew', 'isLoading', 'isLoaded', 'isSaving', 'isObserving', 'isError', 'error' ];
export const meta = [ 'exists', 'metadata' ];

export default Internal.extend({

  store: null,
  ref: null,
  data: null,

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

  onData(props, type, fetch) {
    let data = this.data;
    data.update(props, 'model');
    if(fetch) {
      data.fetch();
    }
  },

  onNew(props) {
    this.onData(props, 'model', true);
    setChangedProperties(this, { isNew: true });
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
    this.resolveObservers();
  },

  onSnapshot(snapshot) {
    if(snapshot.exists) {
      let json = snapshot.data({ serverTimestamps: 'estimate' });
      this.onData(json, 'raw', true);
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
        let data = this.get('data').serialize('raw');
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

  willObserve() {
    let { isLoading, isLoaded } = this.getProperties('isLoading', 'isLoaded');
    if(!isLoaded && !isLoading) {
      this.set('isLoading', true);
    }
  },

  _subscribeRefOnSnapshot() {
    let ref = this.get('ref.ref');
    return ref.onSnapshot({ includeMetadataChanges: true }, snapshot => actions(() => {
      if(this.isDestroying) {
        return;
      }
      this.onSnapshot(snapshot);
    }));
  },

  observers: observers({
    parent: 'store',
    start(state) {
      this.willObserve();
      state._cancel = this._subscribeRefOnSnapshot();
    },
    stop(state) {
      state._cancel();
    }
  }),

  resolveObservers() {
    this.get('observers').resolve(this.model(true));
  },

  observe() {
    return this.get('observers').add();
  },

  reset() {
    let data = this.data;
    data.fetch();
  },

});
