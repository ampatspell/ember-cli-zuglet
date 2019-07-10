import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { resolve, defer } from 'rsvp';
import _queue from '../../queue/computed';
import actions from '../../util/actions';
import settle from '../../util/settle';
import { A } from '@ember/array';

let queue = () => _queue('serialized', 'store.queue');

export default Internal.extend({

  store: null,
  user: null,

  queue: queue(),
  state: queue(),

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

  restoreUserInternal(internal) {
    console.log('restoreUserInternal', internal+'');

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
    console.log('restoreUser', user && user.uid);
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

    return this.restoreUserInternal(internal).then(() => this.notifyUser());
  },

  //

  onAuthStateChanged(user) {
    console.log('onAuthStateChanged', user && user.uid);
    return this.get('state').schedule({
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
    if(this.isDestroying) {
      return;
    }
    console.log('notifyUser');
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
    let promises = key => this.get(key).promises();
    return settle(() => [
      ...promises('queue'),
      ...promises('state')
    ]);
  },

  withAuth(fn) {
    let auth = this.get('auth');
    return resolve(fn(auth));
  },

  withAuthReturningUser(fn) {
    return this.get('queue').schedule({
      name: 'auth',
      invoke: () => this.withAuth(auth => {
        let current = this.get('user.user') || null;
        let waiter = this.waitForUser();
        return fn(auth).then(next => {
          if(current === next) {
            console.log('current===next', current);
            // same user
            waiter.cancel();
          } else {
            console.log('waitForUser');
            // wait for onAuthStateChanged
            return waiter.promise;
          }
        }).then(() => this.get('user'));
      })
    });
  },

  //

  willDestroy() {
    this.stopObservingAuthState();
    let user = this.get('user');
    user && user.destroy();
    this._super(...arguments);
  }

});
