import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { defer, resolve } from 'rsvp';
import Internal from './internal';
import firebase from 'firebase';
import queue from './util/queue/computed';
import settle from './util/settle';

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

  _deferred: computed(function() {
    return defer();
  }).readOnly(),

  ready: readOnly('_deferred.promise'),

  queue: queue('concurrent'),

  factoryFor(name) {
    return this.stores.factoryFor(name);
  },

  didCreateModel(model) {
    let identifier = this.get('identifier');
    let options = model.get('options');
    assert(`identifier is required`, !!identifier);
    assert(`options must be object`, typeof options === 'object');
    initializeFirebase(identifier, options).then(app => {
      this.app = app;
      this.get('_deferred').resolve();
    });
  },

  createModel() {
    return this.factory.create({ _internal: this });
  },

  createInternalDocumentReferenceForReference(ref) {
    return this.factoryFor('zuglet:reference/document/internal').create({ store: this, ref });
  },

  createInternalCollectionReferenceForReference(ref) {
    return this.factoryFor('zuglet:reference/collection/internal').create({ store: this, ref });
  },

  createInternalQueryReferenceForReference(ref) {
    return this.factoryFor('zuglet:reference/query/internal').create({ store: this, ref });
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
    return this.factoryFor('zuglet:document/internal').create({ store: this, ref });
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

  settle() {
    return settle(() => [ 
      ...this.get('queue').promises()
    ]);
  },

  willDestroy() {
    this.app && this.app.delete();
    this._super(...arguments);
  }

});
