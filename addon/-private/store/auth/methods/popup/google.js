import EmberObject from '@ember/object';
import firebase from "firebase/app";
import { registerPromise } from '../../../../stores/stats';

export default class PopupGoogleAuthMethod extends EmberObject {

  signIn(scopes) {
    scopes = scopes || [ 'profile', 'email' ];
    return this.auth._withAuthReturningUser(async auth => {
      let provider = new firebase.auth.GoogleAuthProvider();
      scopes.forEach(scope => provider.addScope(scope));
      let { user, credential: { accessToken } } = await registerPromise(this, 'sign-in', auth.signInWithPopup(provider));
      return { user, google: { accessToken } };
    });
  }

}
