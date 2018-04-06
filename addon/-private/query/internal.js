import Internal from '../internal';
import { computed } from '@ember/object';
import task from '../task/computed';
import setChangedProperties from '../util/set-changed-properties';
import { reject } from 'rsvp';

export const state = [ 'isLoading', 'isLoaded', 'isError', 'error' ];
export const meta = [ 'size', 'empty', 'metadata' ];

export default Internal.extend({

  store: null,
  opts: null,

  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null,

  size: undefined,
  metadata: undefined,
  empty: undefined,

  content: null,

  //

  query: computed(function() {
    let firestore = this.store.app.firestore();
    let fn = this.get('opts.query');
    return fn(firestore);
  }),

  willLoad() {
    setChangedProperties(this, {
      isLoading: true,
      isError: false,
      error: null,
      size: undefined,
      metadata: undefined,
      empty: undefined
    });
  },

  _didLoad(snapshot) {
    let { size, metadata, empty } = snapshot;
    setChangedProperties(this, { isLoading: false, isLoaded: true, size, metadata, empty });
  },

  didLoad(snapshot) {
    this._didLoad(snapshot);
    return this;
  },

  loadDidFail(err) {
    setChangedProperties(this, { isLoading: false, isError: true, error: err });
    return reject(err);
  },

  loadTask: task('serialized', {
    perform() {
      this.willLoad();
      let query = this.get('query');
      return query.get();
    },
    didResolve(snapshot) {
      return this.didLoad(snapshot);
    },
    didReject(err) {
      return this.loadDidFail(err);
    }
  }),

  //

  load() {
    return this.get('loadTask.promise');
  }

});


/*

// Observers

  _observers: 0,
  isObserving: gt('_observers', 0),

  _startObserving() {
    this._cancelOnSnapshot = this.get('_query').onSnapshot({
      includeDocumentMetadataChanges: true,
      includeQueryMetadataChanges: true
    }, snapshot => join(() => this._onSnapshot(snapshot)));
  },

  _stopObserving() {
    this._cancelOnSnapshot();
    this.__cancelOnSnapshot = null;
  },

  observe() {
    let observers = this.get('_observers');
    if(observers === 0) {
      this._startObserving();
    }
    this.set('_observers', observers + 1);

    let detached = false;
    return () => {
      if(detached) {
        return;
      }
      detached = true;
      let observers = this.get('_observers');
      if(observers === 1) {
        this._stopObserving();
      }
      this.set('_observers', observers - 1);
    };
  }

// Array

  _didLoad(snapshot) {
    let store = this.store;
    let documents = A(snapshot.docs.map(doc => store._createDocumentFromSnapshot(doc)));
    this.set('content', documents);
    return this._super(...arguments);
  },

  _onChange(change) {
    let { type, oldIndex, newIndex, doc: snapshot } = change;

    let path = snapshot.ref.path;

    let content = this.get('content');
    let document = content.findBy('path', path);

    if(type === 'added') {
      if(!document) {
        console.log('add new', path);
      } else {
        console.log('add existing', path);
      }
    } else if(type === 'modified') {
      if(document) {
        document._onSnapshot(snapshot);
      } else {
        console.log('modified non existant', path);
      }
    } else if(type === 'removed') {
      console.log('removed', path);
    }
  },

  _onSnapshot(snapshot) {
    snapshot.docChanges.map(change => this._onChange(change));
    return this._super(...arguments);
  }


*/