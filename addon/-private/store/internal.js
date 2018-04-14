import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import { defer, resolve } from 'rsvp';
import queue from '../queue/computed';
import settle from '../util/settle';
import destroyCached from '../util/destroy-cached';
import firebase from 'firebase';

const initializeFirebase = (identifier, opts) => {
  let config = opts.firebase;
  let app = firebase.initializeApp(config, identifier);
  if(opts.firestore && opts.firestore.persistenceEnabled) {
    return resolve(app.firestore().enablePersistence()).catch(() => {}).then(() => app);
  }
  return resolve(app);
}

export default Internal.extend({

  stores: null,
  identifier: null,
  factory: null,

  app: null,

  observed: computed(function() {
    return A();
  }).readOnly(),

  observedProxy: computed(function() {
    let content = this.get('observed');
    return this.factoryFor('zuglet:store/observed').create({ content });
  }).readOnly(),

  _deferred: computed(function() {
    return defer();
  }).readOnly(),

  ready: readOnly('_deferred.promise'),

  queue: queue('concurrent'),

  factoryFor(name) {
    return this.stores.factoryFor(name);
  },

  prepareFirebase(model) {
    let identifier = this.get('identifier');
    let options = model.get('options');
    assert(`identifier is required`, !!identifier);
    assert(`options must be object`, typeof options === 'object');
    return initializeFirebase(identifier, options).then(app => {
      this.app = app;
    });
  },

  prepareAuth() {
    return this.get('auth').prepare();
  },

  didCreateModel(model) {
    resolve()
      .then(() => this.prepareFirebase(model))
      .then(() => this.prepareAuth(model))
      .then(() => this.get('_deferred').resolve());
  },

  createModel() {
    return this.factory.create({ _internal: this });
  },

  createInternalDocumentReferenceForReference(ref, _parent) {
    return this.factoryFor('zuglet:reference/document/internal').create({ store: this, ref, _parent });
  },

  createInternalCollectionReferenceForReference(ref, _parent) {
    return this.factoryFor('zuglet:reference/collection/internal').create({ store: this, ref, _parent });
  },

  createInternalQueryReferenceForReference(ref, _parent, info) {
    return this.factoryFor('zuglet:reference/query/internal').create({ store: this, ref, _parent, info });
  },

  createInternalQueryWithReference(query, opts={}) {
    let type = opts.type;
    assert(`query opts.type must be 'array' or 'first'`, [ 'array', 'first' ].includes(type));
    let factoryName;
    if(type === 'array') {
      factoryName = 'zuglet:query/array/internal';
    } else if(type === 'first') {
      factoryName = 'zuglet:query/first/internal';
    }
    return this.factoryFor(factoryName).create({ store: this, query });
  },

  createInternalDocumentWithRef(ref) {
    let data = this.get('dataManager').createNewInternalObject();
    return this.factoryFor('zuglet:document/internal').create({ store: this, ref, data });
  },

  createNewInternalDocumentWithRef(ref, props) {
    let internal = this.createInternalDocumentWithRef(ref);
    internal.onNew(props);
    return internal;
  },

  createInternalDocumentForSnapshot(snapshot) {
    let ref = this.createInternalDocumentReferenceForReference(snapshot.ref);
    let internal = this.createInternalDocumentWithRef(ref);
    internal.onSnapshot(snapshot);
    return internal;
  },

  updateInternalDocumentForSnapshot(internal, snapshot) {
    internal.onSnapshot(snapshot);
    return internal;
  },

  //

  collection(path) {
    let collection = this.app.firestore().collection(path);
    return this.createInternalCollectionReferenceForReference(collection);
  },

  doc(path) {
    let ref = this.app.firestore().doc(path);
    return this.createInternalDocumentReferenceForReference(ref);
  },

  //

  dataManager: computed(function() {
    return this.factoryFor('zuglet:data/manager').create({ store: this });
  }),

  object(...args) {
    return this.get('dataManager').createNewInternalObject(...args);
  },

  array(...args) {
    return this.get('dataManager').createNewInternalArray(...args);
  },

  //

  auth: computed(function() {
    return this.factoryFor('zuglet:auth/internal').create({ store: this });
  }),

  //

  registerObservedInternal(internal) {
    let observed = this.get('observed');
    assert(`observed already has ${internal} registered`, !observed.includes(internal));
    observed.pushObject(internal);
  },

  unregisterObservedInternal(internal) {
    let observed = this.get('observed');
    assert(`observed does not have ${internal} registered`, observed.includes(internal));
    observed.removeObject(internal);
  },

  //

  settle() {
    return settle(() => [
      ...this.get('queue').promises()
    ]);
  },

  willDestroy() {
    destroyCached(this, 'dataManager');
    destroyCached(this, 'auth');
    this.get('observed').map(internal => internal.destroy());
    this.app && this.app.delete();
    this._super(...arguments);
  }

});
