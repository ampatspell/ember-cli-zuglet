import AuthMethod from './method';
import firebase from 'firebase/app';
import { registerPromise } from '../../../stores/stats';

export default class EmailAuthMethod extends AuthMethod {

  signIn(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', auth.signInWithEmailAndPassword(email, password));
      return { user };
    });
  }

  signUp(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-up', auth.createUserWithEmailAndPassword(email, password));
      return { user };
    });
  }

  credential(email, password) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  }

  sendPasswordReset(email, opts) {
    return this.auth._withAuth(auth => {
      return registerPromise(this, 'send-password-reset', auth.sendPasswordResetEmail(email, opts));
    });
  }

}
