import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import destroyCached from '../../util/destroy-cached';
import queue from '../../queue/computed';
import actions from '../../util/actions';

export default Internal.extend({

  store: null,
  user: null,

  queue: queue('serialized', 'store.queue'),

  init() {
    this._super(...arguments);
    this.promise = resolve();
  },

  prepare() {
    this.startObservingAuthState();
    this.onUser(this.get('auth').currentUser);
    return this.settle();
  },

  createModel() {
    return this.factoryFor('zuglet:auth').create({ _internal: this });
  },

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  auth: computed(function() {
    return this.store.app.auth();
  }).readOnly(),

  methods: computed(function() {
    return this.store.factoryFor('zuglet:auth/methods/internal').create({ auth: this });
  }).readOnly(),

  //

  createUserInternal(user) {
    return this.factoryFor('zuglet:auth/user/internal').create({ auth: this, user });
  },

  restoreUserInternal(internal) {
    let store = this.get('store').model(true);
    return resolve().then(() => {
      if(store.isDestroying) {
        return;
      }

      let model = null;

      if(internal) {
        if(internal.isDestroying) {
          return;
        }
        model = internal.model(true);
      }

      return store.restoreUser(model);
    });
  },

  append(fn) {
    let promise = this.promise;
    this.promise = promise.catch(() => {}).finally(fn);
  },

  scheduleUser(user) {
    this.append(() => {
      if(this.isDestroying) {
        return;
      }

      let internal = null;

      if(user) {
        internal = this.createUserInternal(user);
      }

      return this.restoreUserInternal(internal).then(() => {
        if(this.isDestroying) {
          return;
        }
        this.set('user', internal);
      });
    });
  },

  onUser(user) {
    let current = this.get('user');

    if(user) {
      if(current && current.user === user) {
        return;
      }
      this.scheduleUser(user);
    } else {
      if(!current) {
        return;
      }
      this.scheduleUser(null);
      this.set('user', null);
    }

    if(current) {
      current.destroy();
    }
  },

  //

  onAuthStateChanged(user) {
    this.onUser(user);
  },

  startObservingAuthState() {
    this._authStateObserver = this.get('auth').onAuthStateChanged(user => actions(() => this.onAuthStateChanged(user)));
  },

  stopObservingAuthState() {
    this._authStateObserver && this._authStateObserver();
  },

  //

  signOut() {
    return this.withAuthReturningUser(auth => auth.signOut().then(() => null));
  },

  //

  settle() {
    return this.promise;
  },

  withAuth(fn) {
    let auth = this.get('auth');
    return resolve(fn(auth));
  },

  withAuthReturningUser(fn) {
    return this.get('queue').schedule({
      name: 'auth',
      promise: this.withAuth(fn)
        .then(user => this.onUser(user))
        .then(() => this.settle())
        .then(() => this.get('user'))
    });
  },

  //

  willDestroy() {
    this.stopObservingAuthState();
    destroyCached(this, 'user');
    this._super(...arguments);
  }

});
