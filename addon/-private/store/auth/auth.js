import 'firebase/compat/auth';
import ZugletObject from '../../object';
import { defer } from '../../util/defer';
import { activate } from '../../model/properties/activate';
import { objectToJSON } from '../../util/object-to-json';
import { cached } from '../../model/decorators/cached';
import { toJSON } from '../../util/to-json';
import { registerObserver, registerPromise } from '../../stores/stats';
import { getFactory } from '../../factory/get-factory';
import { assert } from '@ember/debug';

export default class Auth extends ZugletObject {

  @activate()
  user;

  constructor(owner, { store }) {
    super(owner);
    this.store = store;
    this._maybeSetupEmulator();
    this._deferred = defer();
  }

  get promise() {
    return this._deferred.promise;
  }

  async signOut() {
    await this._withAuthReturningUser(async auth => {
      await registerPromise(this, 'sign-out', true, auth.signOut());
      return null;
    });
  }

  //

  verifyPasswordResetCode(code) {
    return this._withAuth(auth => {
      return registerPromise(this, 'verify-password-reset-code', true, auth.verifyPasswordResetCode(code));
    });
  }

  confirmPasswordReset(code, password) {
    return this._withAuth(auth => {
      return registerPromise(this, 'confirm-password-reset', true, auth.confirmPasswordReset(code, password));
    });
  }

  //

  get _auth() {
    return this.store.firebase.auth();
  }

  _maybeSetupEmulator() {
    let emulators = this.store.normalizedOptions.emulators;
    if(emulators.auth) {
      this._auth.useEmulator(emulators.auth, { disableWarnings: true });
    }
  }

  async _withAuth(cb) {
    let auth = this._auth;
    return await cb(auth);
  }

  async _withAuthReturningUser(cb) {
    let hash = await this._withAuth(cb);
    let user = null;
    if(hash) {
      user = hash.user;
      delete hash.user;
    }
    return await this._restoreUser(user, hash);
  }

  _createUser(user) {
    let { store, store: { options: { auth } } } = this;
    if(auth && auth.user) {
      return this.store.models.create(auth.user, { store, user });
    }
    return getFactory(this).zuglet.create('store/auth/user', { store, user });
  }

  async _restoreUser(internal, details) {
    let { user } = this;
    if(internal) {
      if(user && internal.uid === user.uid) {
        await user.restore(internal, details);
      } else {
        user = this._createUser(internal);
        this.user = user;
        await registerPromise(this, 'restore', true, user.restore(internal, details));
      }
    } else {
      user = null;
      this.user = null;
    }
    return user;
  }

  async _deleteUser(user) {
    let internal = user.user;
    assert(`user.user must exist`, !!internal);
    await this._withAuthReturningUser(async () => {
      await registerPromise(this, 'delete', true, internal.delete());
      return null;
    });
  }

  //

  @cached()
  get methods() {
    let auth = this;
    return getFactory(this).zuglet.create('store/auth/methods', { auth });
  }

  //

  async _onAuthStateChange(user) {
    await this._restoreUser(user);
    this._deferred.resolve(this.user);
  }

  onActivated() {
    this._deferred = defer();
    this._cancel = registerObserver(this, wrap => {
      return this._auth.onAuthStateChanged(wrap(user => {
        this._onAuthStateChange(user);
      }), wrap(err => {
        this.store.onObserverError(this, err);
      }));
    });
  }

  _cancelObserver() {
    let { _cancel } = this;
    if(_cancel) {
      _cancel();
      this._cancel = null;
    }
  }

  onDeactivated() {
    this._cancelObserver();
  }

  //

  get serialized() {
    let { user } = this;
    let serialized = {
      user: objectToJSON(user)
    };
    let emulator = this.store.normalizedOptions.emulators.auth;
    if(emulator) {
      serialized.emulator = emulator;
    }
    return serialized;
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
