import AuthMethod from './method';

export default class AnonymousAuthMethod extends AuthMethod {

  signIn() {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await auth.signInAnonymously();
      return { user };
    });
  }

}
