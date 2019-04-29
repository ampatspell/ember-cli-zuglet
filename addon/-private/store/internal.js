import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import { defer, resolve } from 'rsvp';
import queue from '../queue/computed';
import settle from '../util/settle';
import destroyCached from '../util/destroy-cached';
import instantiateFirebase from '../firebase/instantiate';
import { isFirestoreDocumentReference, isFirestoreCollectionReference } from '../util/firestore-types';

const splitReference = (ref, parentRef) => {
  let refs = [];
  while(ref) {
    if(ref instanceof parentRef.constructor && parentRef.isEqual(ref)) {
      return refs.reverse();
    } else {
      refs.push(ref);
    }
    ref = ref.parent;
  }
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

  _functions: computed(function() {
    return Object.create(null);
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
    this.allocator = instantiateFirebase(this, identifier, options);
    return this.allocator.promise.then(app => this.app = app);
  },

  prepareAuth() {
    return this.get('auth').prepare();
  },

  prepareModel(model) {
    return resolve(model.restore());
  },

  didCreateModel(model) {
    resolve()
      .then(() => this.prepareFirebase(model))
      .then(() => this.prepareAuth(model))
      .then(() => this.prepareModel(model))
      .then(() => this.get('_deferred').resolve());
  },

  createModel() {
    return this.factory.create({ _internal: this });
  },

  _createInternalReferenceForNestedReference(ref, internal) {
    assert(`ref is required`, !!ref);
    assert(`parent is required`, !!internal);
    let refs = splitReference(ref, internal.ref);
    assert(`ref parent must be ${internal}`, !!refs);
    return refs.reduce((parent, ref) => {
      if(isFirestoreDocumentReference(ref)) {
        return this._createInternalDocumentReferenceForReference(ref, parent);
      } else if(isFirestoreCollectionReference(ref)) {
        return this._createInternalCollectionReferenceForReference(ref, parent);
      }
      assert(`ref must be a document or collection reference`, false);
    }, internal);
  },

  _createInternalDocumentReferenceForReference(ref, _parent) {
    return this.factoryFor('zuglet:reference/document/internal').create({ store: this, ref, _parent });
  },

  createInternalDocumentReferenceForReference(ref, parent) {
    if(parent) {
      return this._createInternalReferenceForNestedReference(ref, parent);
    }
    return this._createInternalDocumentReferenceForReference(ref);
  },

  _createInternalCollectionReferenceForReference(ref, _parent) {
    return this.factoryFor('zuglet:reference/collection/internal').create({ store: this, ref, _parent });
  },

  createInternalCollectionReferenceForReference(ref, parent) {
    if(parent) {
      return this._createInternalReferenceForNestedReference(ref, parent);
    }
    return this._createInternalCollectionReferenceForReference(ref);
  },

  createInternalQueryReferenceForReference(ref, _parent, info) {
    return this.factoryFor('zuglet:reference/query/internal').create({ store: this, ref, _parent, info });
  },

  internalQueryFactoryNameForType(type, sender) {
    if(type === 'array') {
      return 'zuglet:query/array/internal';
    } else if(type === 'first') {
      return 'zuglet:query/first/internal';
    }
    assert(`query ${sender} must be 'array' or 'first'`, false);
  },

  createInternalQueryWithReference(query, opts={}) {
    opts = assign({ type: 'array', doc: null }, opts);
    let { type, doc } = opts;
    let factoryName = this.internalQueryFactoryNameForType(type, 'opts.type');
    return this.factoryFor(factoryName).create({ store: this, query, opts: { doc: doc } });
  },

  createInternalDocumentWithRef(ref) {
    let data = this.get('dataManager').createRootInternalObject();
    return this.factoryFor('zuglet:document/internal').create({ store: this, ref, data });
  },

  createNewInternalDocumentWithRef(ref, props) {
    let internal = this.createInternalDocumentWithRef(ref);
    internal.onNew(props);
    return internal;
  },

  createExistingInternalDocumentWithRef(ref) {
    let internal = this.createInternalDocumentWithRef(ref);
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
    return this.get('dataManager').createInternalObject(...args);
  },

  array(...args) {
    return this.get('dataManager').createInternalArray(...args);
  },

  serverTimestamp() {
    return this.get('dataManager').createInternalServerTimestamp();
  },

  //

  models: computed(function() {
    return this.factoryFor('zuglet:models/internal').create({ store: this });
  }).readOnly(),

  auth: computed(function() {
    return this.factoryFor('zuglet:auth/internal').create({ store: this });
  }).readOnly(),

  storage: computed(function() {
    return this.factoryFor('zuglet:storage/internal').create({ store: this });
  }).readOnly(),

  functions(region) {
    region = region || undefined;
    let internals = this.get('_functions');
    let internal = internals[region];
    if(!internal) {
      internal = this.factoryFor('zuglet:functions/internal').create({ store: this, region });
      internals[region] = internal;
    }
    return internal;
  },

  //

  transaction(fn) {
    return this.factoryFor('zuglet:transaction/internal').create({ store: this, fn }).run();
  },

  batch(fn) {
    return this.factoryFor('zuglet:batch/internal').create({ store: this, fn }).run();
  },

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
    destroyCached(this, 'storage');
    this.get('observed').map(internal => internal.destroy());
    this.allocator && this.allocator.destroy();
    this._super(...arguments);
  }

});
