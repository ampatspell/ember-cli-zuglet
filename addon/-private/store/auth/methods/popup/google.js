import Method from '../method';
import firebase from "firebase/compat/app";
import { registerPromise } from '../../../../stores/stats';

export default class PopupGoogleAuthMethod extends Method {

  /* istanbul ignore next */
  signIn(scopes) {
    scopes = scopes || [ 'profile', 'email' ];
    return this.auth._withAuthReturningUser(async auth => {
      let provider = new firebase.auth.GoogleAuthProvider();
      scopes.forEach(scope => provider.addScope(scope));
      let { user, credential: { accessToken } } = await registerPromise(this, 'sign-in', false, auth.signInWithPopup(provider));
      return { user, google: { accessToken } };
    });
  }

}
