import 'firebase/auth';
import EmberObject from '@ember/object';
import { defer } from '../../util/defer';
import { activate } from '../../model/properties/activate';
import { getOwner } from '../../util/get-owner';
import { objectToJSON } from '../../util/object-to-json';
import { root } from '../../model/decorators/root';
import { cached } from '../../model/decorators/cached';
import { getState } from '../../model/state';
import { toJSON } from '../../util/to-json';

@root()
export default class Auth extends EmberObject {

  @activate()
  user

  init() {
    super.init(...arguments);
    this._maybeSetupEmulator();
    getState(this); // auto activate self
    this._deferred = defer();
  }

  get promise() {
    return this._deferred.promise;
  }

  async signOut() {
    await this._withAuthReturningUser(async auth => {
      await auth.signOut();
      return null;
    });
  }

  //

  get _auth() {
    return this.store.firebase.auth();
  }

  _maybeSetupEmulator() {
    let emulators = this.store.normalizedOptions.emulators;
    if(emulators.auth) {
      this._auth.useEmulator(emulators.auth);
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
    return getOwner(this).factoryFor(`zuglet:store/auth/user`).create({ store, user });
  }

  async _restoreUser(internal, details) {
    let { user } = this;
    if(internal) {
      if(user && internal.uid === user.user.uid) {
        await user.restore(internal, details);
      } else {
        user = this._createUser(internal);
        this.user = user;
        await user.restore(null, details);
      }
    } else {
      user = null;
      this.user = null;
    }
    return user;
  }

  async _deleteUser(user) {
    let internal = user.user;
    if(!internal) {
      return;
    }
    await this._withAuthReturningUser(async () => {
      await internal.delete();
      return null;
    });
  }

  //

  @cached()
  get methods() {
    let auth = this;
    return getOwner(this).factoryFor('zuglet:store/auth/methods').create({ auth });
  }

  //

  async _onAuthStateChange(user) {
    await this._restoreUser(user);
    this._deferred.resolve(this.user);
  }

  onActivated() {
    this._cancel = this._auth.onAuthStateChanged(user => this._onAuthStateChange(user));
  }

  onDeactivated() {
    this._cancel();
    this._cancel = null;
    this._deferred = defer();
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
