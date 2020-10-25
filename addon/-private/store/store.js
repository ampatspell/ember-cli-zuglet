import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';
import { assert } from '@ember/debug';
import { initializeApp, enablePersistence } from './firebase';

export default class Store extends EmberObject {

  firebase = null
  enablePersistencePromise = null

  init() {
    super.init(...arguments);
    this._initializeApp();
  }

  _initializeApp() {
    let { options } = this;
    assert(`store.options are required`, !!options);
    let { firebase } = options;
    assert(`store.options.firebase is require`, !!firebase);
    this.firebase = initializeApp(firebase, this.identifier);
    if(options.firestore && options.firestore.persistenceEnabled) {
      this.enablePersistencePromise = enablePersistence(this.firebase);
    } else {
      this.enablePersistencePromise = Promise.resolve();
    }
  }

  get models() {
    return this.stores.models;
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

  _createDocumentForReference(ref, data) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/document').create({ store, ref, data });
  }

  _createDocumentForSnapshot(snapshot) {
  }

  // _createQuery({ content }) {
  //   let store = this;
  //   return getOwner(this).factoryFor('zuglet:store/firestore/query').create({ store, content });
  // }

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
    return  {
      identifier,
      projectId
    };
  }

  toStringExtension() {
    let { projectId } = this;
    return `${projectId}`;
  }

}
