import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { toJSON } from '../../util/to-json';

const {
  assign
} = Object;

export default class User extends EmberObject {

  @tracked
  user

  get uid() {
    return this.user.uid;
  }

  get email() {
    return this.user.email;
  }

  get emailVerified() {
    return this.user.emailVerified;
  }

  get photoURL() {
    return this.user.photoURL;
  }

  get displayName() {
    return this.user.displayName;
  }

  get isAnonymous() {
    return this.user.isAnonymous;
  }

  //

  async restore(user) {
    if(user) {
      this.user = user;
    }
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
      return await this.user.getIdToken(refresh);
    } else if(type === 'json') {
      return await this.user.getIdTokenResult(refresh);
    } else {
      assert('Unsupported token type', false);
    }
  }

  async link(_method, ...args) {
    let method = this.store.auth.methods[_method];
    assert(`Unsupported method '${_method}'`, method);
    let credential = method.credential(...args);
    return await this.store.auth._withAuthReturningUser(async () => {
      let { user } = await this.user.linkWithCredential(credential);
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
