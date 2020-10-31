import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';

export default class RouteAuthComponent extends Component {

  @service
  store

  @tracked email
  @tracked password
  @tracked error

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  async signOut() {
    await this.store.auth.signOut();
  }

  @action
  async anonymousSignIn() {
    await this.store.auth.methods.anonymous.signIn();
  }

  @action
  async deleteUser() {
    await this.store.auth.user.delete();
  }

  @action
  async signIn() {
    let { email, password } = this;
    this.error = null;
    try {
      await this.store.auth.methods.email.signIn(email, password);
    } catch(err) {
      this.error = err;
    }
  }

  @action
  async googleSignIn() {
    this.error = null;
    try {
      await store.auth.methods.popup.google.signIn();
    } catch(err) {
      this.error = err;
    }
  }

  toString() {
    return toString(this);
  }

}
