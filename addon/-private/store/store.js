import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';
import { assert } from '@ember/debug';
import { initializeApp, enablePersistence } from './firebase';
import { cached } from '../model/decorators/cached';
import { toJSON } from '../util/to-json';
import firebase from "firebase/app";

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
    } else if(options.firestore.persistenceEnabled) {
      this.enablePersistencePromise = enablePersistence(this.firebase);
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

  doc(path) {
    let ref = path;
    if(typeof ref === 'string') {
      ref = this.firebase.firestore().doc(path);
    }
    return this._createDocumentReference(ref);
  }

  collection(path) {
    let ref = path;
    if(typeof ref === 'string') {
      ref = this.firebase.firestore().collection(path);
    }
    return this._createCollectionReference(ref);
  }

  get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  //

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
    assert(false, `Unsupported type '${type}'`);
  }

  //

  onSnapshotError(model) {
    console.error('onSnapshot', model.string || model.path, model.error.stack);
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

}
