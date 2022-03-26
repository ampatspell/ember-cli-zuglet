import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';
import { signInAnonymously } from 'firebase/auth';

export default class AnonymousAuthMethod extends AuthMethod {

  signIn() {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', signInAnonymously(auth));
      return { user };
    });
  }

}
