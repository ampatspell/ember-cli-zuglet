import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { join } from '@ember/runloop';
import { resolve } from 'rsvp';
import destroyCached from '../../util/destroy-cached';

export default Internal.extend({

  store: null,
  user: null,

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

  scheduleUser(user) {
    this.promise = this.promise.finally(() => {
      let internal = this.createUserInternal(user);
      return internal.restore().then(() => {
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
    }

    this.set('user', null);

    if(current) {
      current.destroy();
    }
  },

  //

  onAuthStateChanged(user) {
    this.onUser(user);
  },

  startObservingAuthState() {
    this._authStateObserver = this.get('auth').onAuthStateChanged(user => join(() => this.onAuthStateChanged(user)));
  },

  stopObservingAuthState() {
    this._authStateObserver && this._authStateObserver();
  },

  //

  signOut() {
    return resolve(this.get('auth').signOut()).then(() => undefined);
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
    return this.withAuth(fn).then(() => this.settle()).then(() => this.get('user'));
  },

  //

  willDestroy() {
    this.stopObservingAuthState();
    destroyCached(this, 'user');
    this._super(...arguments);
  }

});