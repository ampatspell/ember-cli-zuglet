import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { defer, resolve, reject } from 'rsvp';
import EmberError from '@ember/error';
import Internal from './internal';
import firebase from 'firebase';

const initializeFirebase = (identifier, opts) => {
  let config = opts.firebase;
  let app = firebase.initializeApp(config, identifier);
  if(opts.firestore && opts.firestore.persistenceEnabled) {
    return resolve(app.firestore().enablePersistence()).catch(() => {}).then(() => app);
  }
  return resolve(app);
}

const documentMissingError = opts => {
  let err = new EmberError('Document does not exist');
  err.code = 'zuglet/document-missing';
  err.opts = opts;
  return err;
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

  collection(path) {
    let collection = this.app.firestore().collection(path);
    return this.createInternalCollectionReferenceForReference(collection);
  },

  doc(path) {
    let ref = this.app.firestore().doc(path);
    return this.createInternalDocumentReferenceForReference(ref);
  },

  query(opts) {
    return this.factoryFor('zuglet:query/array/internal').create({ store: this, opts });
  },

  loadInternal(opts={}) {
    if(opts.path) {
      let ref = this.app.firestore().doc(opts.path);
      return resolve(ref.get()).then(snapshot => {
        if(!snapshot.exists && !opts.optional) {
          return reject(documentMissingError(opts));
        }
        let result = this.createInternalDocumentForSnapshot(snapshot);
        let type = 'single';
        return { result, type };
      });
    }
    assert(`unsupported load opts`, false);
  },

  load(opts={}) {
    return this.loadInternal(opts).then(({ result, type }) => {
      if(type === 'single') {
        return result && result.model(true);
      }
    });
  },

  createInternalDocumentForSnapshot(snapshot) {
    let ref = snapshot.ref;
    let internal = this.factoryFor('zuglet:document/internal').create({ store: this, ref });
    internal.onSnapshot(snapshot);
    return internal;
  },

  updateInternalDocumentForSnapshot(internal, snapshot) {
    internal.onSnapshot(snapshot);
    return internal;
  },

  willDestroy() {
    this.app && this.app.delete();
    this._super(...arguments);
  }

});
