import ZugletObject from '../object';
import { registerDestructor } from '@ember/destroyable';
import { assert } from '@ember/debug';
import firebase from "firebase/app";
import { initializeApp, enablePersistence, destroyApp } from './firebase';
import { cached, getCached } from '../model/decorators/cached';
import { toJSON } from '../util/to-json';
import { isFastBoot } from '../util/fastboot';
import { isFunction, isDocumentReference, isCollectionReference } from '../util/types';
import { registerPromise } from '../stores/stats';
import { root } from '../model/decorators/root';
import { activate } from '../model/properties/activate';
import { getFactory } from '../factory/get-factory';

const {
  assign
} = Object;

const normalizeOptions = options => {
  assert(`store.options are required`, !!options);
  let { firebase, firestore, auth, functions, emulators } = options;
  assert(`store.options.firebase is required`, !!firebase);
  firestore = assign({ persistenceEnabled: false }, firestore);
  auth = assign({ user: null }, auth);
  functions = assign({ region: null }, functions);
  emulators = assign({ host: 'localhost', firestore: null, auth: null, functions: null }, emulators);
  if(emulators.host) {
    if(emulators.firestore) {
      emulators.firestore = `${emulators.host}:${emulators.firestore}`;
    }
    if(emulators.auth) {
      emulators.auth = `http://${emulators.host}:${emulators.auth}/`;
    }
    if(emulators.functions) {
      emulators.functions = `http://${emulators.host}:${emulators.functions}`;
    }
  }
  return {
    firebase,
    firestore,
    auth,
    functions,
    emulators
  };
}

const activated = activate().content((store, key) => store._factory.zuglet.create(`store/${key}`, { store }));

@root()
export default class Store extends ZugletObject {

  identifier = null
  firebase = null
  enablePersistencePromise = null

  constructor(owner, { stores, identifier }) {
    super(owner);
    this.stores = stores;
    this.identifier = identifier;
    registerDestructor(this, () => this._destroy());
  }

  @cached()
  get normalizedOptions() {
    return normalizeOptions(this.options);
  }

  _initialize() {
    let { normalizedOptions: options } = this;
    this.firebase = initializeApp(options.firebase, this.identifier);
    this.enablePersistencePromise = Promise.resolve();
    if(options.emulators.firestore) {
      this.firebase.firestore().settings({
        host: options.emulators.firestore,
        ssl: false
      });
    } else if(options.firestore.persistenceEnabled && !isFastBoot(this)) {
      this.enablePersistencePromise = registerPromise(this, 'enable-persistence', enablePersistence(this.firebase));
    }
  }

  @cached()
  get _factory() {
    return getFactory(this);
  }

  get models() {
    return this._factory.models;
  }

  @activated auth
  @activated storage
  @activated functions

  //

  doc(arg) {
    let ref = this._toDocumentReference(arg);
    return this._createDocumentReference(ref);
  }

  collection(arg) {
    let ref = this._toCollectionReference(arg);
    return this._createCollectionReference(ref);
  }

  transaction(cb) {
    return registerPromise(this, 'transaction', this.firebase.firestore().runTransaction(async tx => {
      let transaction = this._createTransaction(tx);
      return await cb(transaction);
    }));
  }

  async _batchWithCallback(cb) {
    let batch = this._createBatch();
    let result = await cb(batch);
    await batch.commit();
    return result;
  }

  batch(cb) {
    if(isFunction(cb)) {
      return this._batchWithCallback(cb);
    }
    return this._createBatch();
  }

  get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  //

  _toDocumentReference(arg) {
    if(isDocumentReference(arg)) {
      return arg;
    } else if(typeof arg === 'string' && !!arg) {
      return this.firebase.firestore().doc(arg);
    }
    assert(`argument must be string not '${arg}'`, false);
  }

  _toCollectionReference(arg) {
    if(isCollectionReference(arg)) {
      return arg;
    } else if(typeof arg === 'string' && !!arg) {
      return this.firebase.firestore().collection(arg);
    }
    assert(`argument must be string not '${arg}'`, false);
  }

  _createDocumentReference(_ref) {
    let store = this;
    return this._factory.zuglet.create('store/firestore/reference/document', { store, _ref });
  }

  _createCollectionReference(_ref) {
    let store = this;
    return this._factory.zuglet.create('store/firestore/reference/collection', { store, _ref });
  }

  _createConditionReference(_ref, string) {
    let store = this;
    return this._factory.zuglet.create('store/firestore/reference/condition', { store, _ref, string });
  }

  _createBatch() {
    let store = this;
    let _batch = this.firebase.firestore().batch();
    return this._factory.zuglet.create('store/firestore/batch', { store, _batch });
  }

  _createTransaction(_tx) {
    let store = this;
    return this._factory.zuglet.create('store/firestore/transaction', { store, _tx });
  }

  _createDocumentWithProperties(props) {
    return this._factory.zuglet.create('store/firestore/document', props);
  }

  _createDocumentForReference(ref, data) {
    let store = this;
    return this._createDocumentWithProperties({ store, ref, data });
  }

  _createDocumentForSnapshot(snapshot, parent) {
    let store = this;
    let ref = this._createDocumentReference(snapshot.ref);
    return this._createDocumentWithProperties({ store, ref, snapshot, parent });
  }

  _createQuery(ref, opts) {
    let { type } = assign({ type: 'array' }, opts);
    let { _factory } = this;
    let store = this;
    if(type === 'array') {
      return _factory.zuglet.create('store/firestore/query/array', { store, ref });
    } else if(type === 'first' || type === 'single') {
      return _factory.zuglet.create('store/firestore/query/single', { store, ref });
    }
    assert(`Unsupported type '${type}'`, false);
  }

  //

  onObserverError(model, err) {
    err = err || model.error;
    let stack = (err && err.stack) || err;
    let path = model.string || model.path || String(model);
    console.error('onSnapshot', path, stack);
  }

  //

  get projectId() {
    return this.firebase.options.projectId;
  }

  get dashboardURL() {
    return `https://console.firebase.google.com/u/0/project/${this.projectId}/overview`;
  }

  openDashboard() {
    window.open(this.dashboardURL, '_blank');
  }

  //

  get serialized() {
    let { identifier, projectId } = this;
    let serialized = {
      identifier,
      projectId
    };
    let emulator = this.normalizedOptions.emulators.firestore;
    if(emulator) {
      serialized.emulator = emulator;
    }
    return serialized;
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    let { projectId } = this;
    return `${projectId}`;
  }

  //

  _destroy() {
    getCached(this, 'auth')?.destroy();
    destroyApp(this.firebase);
  }

}
