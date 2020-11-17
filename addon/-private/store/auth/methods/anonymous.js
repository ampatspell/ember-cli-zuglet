import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';

export default class AnonymousAuthMethod extends AuthMethod {

  signIn() {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', auth.signInAnonymously());
      return { user };
    });
  }

}
