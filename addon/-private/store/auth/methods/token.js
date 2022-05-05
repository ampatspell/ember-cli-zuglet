import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';

export default class TokenAuthMethod extends AuthMethod {

  signIn(token) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', true, auth.signInWithCustomToken(token));
      return { user };
    });
  }

}
