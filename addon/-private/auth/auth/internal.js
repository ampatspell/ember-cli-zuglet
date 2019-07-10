import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { resolve, defer } from 'rsvp';
import queue from '../../queue/computed';
import actions from '../../util/actions';
import settle from '../../util/settle';
import { A } from '@ember/array';

export default Internal.extend({

  store: null,
  user: null,

  queue: queue('serialized', 'store.queue'),

  init() {
    this._super(...arguments);
    this._waitForUser = A();
  },

  prepare() {
    this.startObservingAuthState();
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

  // onUser(user) {
  //   let current = this.get('user');

  //   if(user) {
  //     if(current && current.user === user) {
  //       current.notifyPropertyChange('user');
  //       return;
  //     }
  //     this.scheduleUser(user);
  //   } else {
  //     if(!current) {
  //       return;
  //     }
  //     this.scheduleUser(null);
  //     this.set('user', null);
  //   }

  //   if(current) {
  //     current.destroy();
  //   }
  // },

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

  restoreUser(user) {
    console.log('restoreUser', user);
    if(this.isDestroying) {
      return;
    }

    let internal = null;

    if(user) {
      internal = this.createUserInternal(user);
    }

    let current = this.get('user');
    this.set('user', internal);

    if(current) {
      current.destroy();
    }

    return this.restoreUserInternal(internal);
  },

  //

  onAuthStateChanged(user) {
    console.log('onAuthStateChanged', user);
    return this.get('queue').schedule({
      name: 'restore',
      invoke: () => this.restoreUser(user)
    });
  },

  startObservingAuthState() {
    this._authStateObserver = this.get('auth').onAuthStateChanged(user => actions(() => this.onAuthStateChanged(user)));
  },

  stopObservingAuthState() {
    this._authStateObserver && this._authStateObserver();
  },

  //

  waitForUser() {
    let deferred = defer();
    let promise = deferred.promise;

    let array = this._waitForUser;
    let object = {};

    let resolve = () => deferred.resolve();
    let cancel = () => array.removeObject(object);

    object = {
      resolve,
      cancel,
      promise
    };

    array.pushObject(object);

    return object;
  },

  notifyUser() {
    let listeners = this._waitForUser.slice();
    this._waitForUser.clear();
    listeners.forEach(listener => listener.resolve());
  },

  //

  signOut() {
    return this.withAuthReturningUser(auth => auth.signOut().then(() => null));
  },

  //

  settle() {
    return settle(() => [
      ...this.get('queue').promises()
    ]);
  },

  withAuth(fn) {
    let auth = this.get('auth');
    return resolve(fn(auth));
  },

  // _withAuthReturningUser(fn) {
  //   return this.withAuth(fn)
  //     .then(user => this.onUser(user))
  //     .then(() => this.settle())
  //     .then(() => this.get('user'));
  // },

  // withAuthReturningUser(fn) {
  //   return this.get('queue').schedule({
  //     name: 'auth',
  //     invoke: () => this._withAuthReturningUser(fn)
  //   });
  // },

  //

  willDestroy() {
    this.stopObservingAuthState();
    let user = this.get('user');
    user && user.destroy();
    this._super(...arguments);
  }

});
