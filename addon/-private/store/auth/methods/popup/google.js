import Method from '../method';
import { registerPromise } from '../../../../stores/stats';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default class PopupGoogleAuthMethod extends Method {

  /* istanbul ignore next */
  signIn(scopes) {
    scopes = scopes || [ 'profile', 'email' ];
    return this.auth._withAuthReturningUser(async auth => {
      let provider = new GoogleAuthProvider();
      scopes.forEach(scope => provider.addScope(scope));
      let { user, credential: { accessToken } } = await registerPromise(this, 'sign-in', signInWithPopup(auth, provider));
      return { user, google: { accessToken } };
    });
  }

}
