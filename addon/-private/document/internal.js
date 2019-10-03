import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { resolve, reject } from 'rsvp';
import setChangedProperties from '../util/set-changed-properties';
import { assertDocumentInternalReference } from '../reference/document/internal';
import observers from '../observers/computed';
import queue from '../queue/computed';
import actions from '../util/actions';
import randomString from '../util/random-string';

export const state = [ 'isNew', 'isDirty', 'isLoading', 'isLoaded', 'isSaving', 'isObserving', 'isError', 'error' ];
export const meta = [ 'exists', 'metadata' ];

const _token = '_token';

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

  isDirty: readOnly('data.isDirty'),

  exists: undefined,
  _metadata: undefined,

  token: computed(function() {
    return randomString(20);
  }).readOnly(),

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

  factoryFor(name) {
    return this.get('store').factoryFor(name);
  },

  onData(props, deserialize) {
    this.data.commit(props, deserialize);
  },

  onNew(props) {
    this.onData(props);
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

  shouldApplySnapshotData(json) {
    let token = json[_token];
    delete json[_token];
    return this.get('token') !== token;
  },

  onSnapshot(snapshot) {
    if(snapshot.exists) {
      let json = snapshot.data({ serverTimestamps: 'estimate' });
      if(this.shouldApplySnapshotData(json)) {
        this.onData(json);
      }
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
    let { force, source } = opts;
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading && !force) {
      return resolve(this);
    }

    return this.get('queue').schedule({
      name: 'document/load',
      reuse: operations => operations.findBy('name', 'document/load'),
      invoke: () => {
        this.willLoad();
        let ref = this.get('ref.ref');
        return ref.get({ source });
      },
      didResolve: snapshot => this.didLoad(snapshot),
      didReject: err => this.loadDidFail(err)
    });
  },

  reload(opts) {
    return this.load(assign({ force: true }, opts));
  },

  willSave(data, opts) {
    let { token } = opts;

    if(token) {
      data[_token] = this.get('token');
    }

    setChangedProperties(this, {
      isSaving: true,
      isError: false,
      error: null
    });
  },

  didSave(raw) {
    this.onData(raw, false);
    setChangedProperties(this, {
      isNew: false,
      isSaving: false,
      isLoaded: true,
      exists: true
    });
    return this;
  },

  saveDidFail(err, opts) {
    let { optional } = opts;
    if(err.code === 'not-found' && optional) {
      setChangedProperties(this, { isSaving: false, exists: false });
      return this;
    } else {
      setChangedProperties(this, { isSaving: false, isError: true, error: err });
      return reject(err);
    }
  },

  _save(ref, data, opts) {
    let { type, merge } = opts;
    if(type === 'set') {
      return ref.set(data, { merge }).then(() => data);
    } else if(type === 'update') {
      return ref.update(data).then(() => data);
    }
    assert(`unsupported set type '${type}'`, false);
  },

  _normalizeSaveOptions(opts={}) {
    return assign({ type: 'set', merge: false, optional: false }, opts);
  },

  _shouldSkipSave(opts) {
    let { isDirty, isNew } = this.getProperties('isDirty', 'isNew');
    return opts.optional && opts.type === 'set' && !isDirty && !isNew;
  },

  save(opts) {
    opts = this._normalizeSaveOptions(opts);
    return this.get('queue').schedule({
      name: 'document/save',
      invoke: () => {
        if(this._shouldSkipSave(opts)) {
          return;
        }
        let ref = this.get('ref.ref');
        let data = this.get('data').serialize('raw');
        this.willSave(data, opts);
        return this._save(ref, data, opts);
      },
      didResolve: raw => {
        if(!raw) {
          return this;
        }
        return this.didSave(raw);
      },
      didReject: err => this.saveDidFail(err, opts)
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
    }), err => {
      console.error(`document ${this._model} onSnapshot`, err);
    });
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
    let store = this.get('store');
    let doc = this;
    return this.get('observers').add('zuglet:observer/document/internal', { store, doc });
  },

  reset() {
    let data = this.data;
    data.rollback();
  },

  //

  loadInTransaction(transaction) {
    return this.get('queue').schedule({
      name: 'document/load/transaction',
      invoke: () => {
        this.willLoad();
        let ref = this.get('ref.ref');
        return transaction.instance.get(ref);
      },
      didResolve: snapshot => this.didLoad(snapshot),
      didReject: err => this.loadDidFail(err)
    });
  },

  saveInContext(instance, opts) {
    opts = this._normalizeSaveOptions(opts);
    let { type, merge } = opts;

    let ref = this.get('ref.ref');
    let data = this.get('data').serialize('raw');

    if(type === 'set') {
      return instance.set(ref, data, { merge });
    } else if(type === 'update') {
      return instance.update(ref, data);
    }

    assert(`unsupported set type '${type}'`, false);
  },

  saveInTransaction(transaction, opts) {
    this.saveInContext(transaction.instance, opts);
  },

  saveInBatch(batch, opts) {
    this.saveInContext(batch.instance, opts);
  },

  deleteInContext(instance) {
    let ref = this.get('ref.ref');
    instance.delete(ref);
  },

  deleteInTransaction(transaction) {
    this.deleteInContext(transaction.instance);
  },

  deleteInBatch(batch) {
    this.deleteInContext(batch.instance);
  }

});
