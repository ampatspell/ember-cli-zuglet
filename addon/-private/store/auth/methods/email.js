import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider
} from 'firebase/auth';

export default class EmailAuthMethod extends AuthMethod {

  signIn(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', signInWithEmailAndPassword(auth, email, password));
      return { user };
    });
  }

  signUp(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-up', createUserWithEmailAndPassword(auth, email, password));
      return { user };
    });
  }

  credential(email, password) {
    return EmailAuthProvider.credential(email, password);
  }

  sendPasswordReset(email, opts) {
    return this.auth._withAuth(auth => {
      return registerPromise(this, 'send-password-reset', sendPasswordResetEmail(auth, email, opts));
    });
  }

}
