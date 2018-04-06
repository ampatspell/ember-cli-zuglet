import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { join } from '@ember/runloop';
import { resolve, reject } from 'rsvp';
import Internal from './internal';
import setChangedProperties from './util/set-changed-properties';
import task from './task/computed';
import { observers } from './util/observers';
import { assertDocumentInternalReference } from './reference/document-internal';

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
    // TODO: queue
    return this.get('loadTask.promise');
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
    // TODO: queue
    let ref = this.get('ref.ref');
    let data = this.get('data');
    this.willSave();
    return resolve(ref.set(data)).then(() => this.didSave(), err => this.saveDidFail(err));
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
    // TODO: queue
    let ref = this.get('ref.ref');
    this.willDelete();
    return resolve(ref.delete()).then(() => this.didDelete(), err => this.deleteDidFail(err));
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
