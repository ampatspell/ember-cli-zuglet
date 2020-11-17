import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import firebase from "firebase/app";
import { initializeApp, enablePersistence, destroyApp } from './firebase';
import { cached, getCached } from '../model/decorators/cached';
import { getOwner } from '../util/get-owner';
import { toJSON } from '../util/to-json';
import { isFastBoot } from '../util/fastboot';
import { isFunction, isDocumentReference, isCollectionReference } from '../util/object-to-json';
import { registerPromise } from '../stores/stats';

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

export default class Store extends EmberObject {

  identifier = null
  firebase = null
  enablePersistencePromise = null

  init() {
    super.init(...arguments);
    this._initializeApp();
  }

  @cached()
  get normalizedOptions() {
    return normalizeOptions(this.options);
  }

  _initializeApp() {
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

  get models() {
    return this.stores.models;
  }

  @cached()
  get auth() {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/auth').create({ store });
  }

  @cached()
  get storage() {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/storage').create({ store });
  }

  @cached()
  get functions() {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/functions').create({ store });
  }

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
    return getOwner(this).factoryFor('zuglet:store/firestore/reference/document').create({ store, _ref });
  }

  _createCollectionReference(_ref) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/reference/collection').create({ store, _ref });
  }

  _createConditionReference(_ref, string) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/reference/condition').create({ store, _ref, string });
  }

  _createBatch() {
    let store = this;
    let _batch = this.firebase.firestore().batch();
    return getOwner(this).factoryFor('zuglet:store/firestore/batch').create({ store, _batch });
  }

  _createTransaction(_tx) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/transaction').create({ store, _tx });
  }

  _createDocumentWithProperties(props) {
    return getOwner(this).factoryFor('zuglet:store/firestore/document').create(props);
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
    let store = this;
    if(type === 'array') {
      return getOwner(this).factoryFor('zuglet:store/firestore/query/array').create({ store, ref });
    } else if(type === 'first' || type === 'single') {
      return getOwner(this).factoryFor('zuglet:store/firestore/query/single').create({ store, ref });
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

  get dashboard() {
    return `https://console.firebase.google.com/u/0/project/${this.projectId}/overview`;
  }

  openDashboard() {
    window.open(this.dashboard, '_blank');
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

  willDestroy() {
    getCached(this, 'auth')?.destroy();
    destroyApp(this.firebase);
    super.willDestroy(...arguments);
  }

}
