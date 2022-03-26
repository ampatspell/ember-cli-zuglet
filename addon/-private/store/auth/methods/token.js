import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';
import { signInWithCustomToken } from 'firebase/auth';

export default class TokenAuthMethod extends AuthMethod {

  signIn(token) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', signInWithCustomToken(auth, token));
      return { user };
    });
  }

}
