import ZugletObject from '../../object';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { toJSON } from '../../util/to-json';
import { tracked } from "@glimmer/tracking";
import { registerPromise } from '../../stores/stats';

const {
  assign
} = Object;

const trackedProperties = [ 'uid', 'email', 'emailVerified', 'photoURL', 'displayName', 'isAnonymous' ];

const updateTrackedProperties = (target, source) => {
  trackedProperties.forEach(key => {
    let value = source[key];
    if(target[key] !== value) {
      target[key] = value;
    }
  });
};

export default class User extends ZugletObject {

  @tracked user

  @tracked uid
  @tracked email
  @tracked emailVerified
  @tracked photoURL
  @tracked displayName
  @tracked isAnonymous

  constructor(owner, { store, user }) {
    super(owner);
    this.store = store;
    this.user = user;
  }

  //

  async restore(user) {
    updateTrackedProperties(this, user);
    this.user = user;
  }

  //

  signOut() {
    return this.store.auth.signOut();
  }

  delete() {
    return this.store.auth._deleteUser(this);
  }

  async token(opts) {
    let { type, refresh } = assign({ type: 'string', refresh: false }, opts);
    if(type === 'string') {
      return await registerPromise(this, 'token', this.user.getIdToken(refresh));
    } else if(type === 'json') {
      return await registerPromise(this, 'token', this.user.getIdTokenResult(refresh));
    } else {
      assert('Unsupported token type', false);
    }
  }

  async link(_method, ...args) {
    let method = get(this.store.auth.methods, _method);
    assert(`Unsupported method '${_method}'`, method);
    let credential = method.credential(...args);
    return await this.store.auth._withAuthReturningUser(async () => {
      let { user } = await registerPromise(this, 'link', this.user.linkWithCredential(credential));
      return { user };
    });
  }

  //

  get serialized() {
    let { isAnonymous, uid, email, emailVerified } = this;
    return {
      isAnonymous,
      uid,
      email,
      emailVerified
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    let { uid, email } = this;
    return `${email || uid}`;
  }

}
