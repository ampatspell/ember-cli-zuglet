import AuthMethod from './method';
import { registerPromise } from '../../../stores/stats';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  EmailAuthProvider
} from 'firebase/auth';

const {
  assign
} = Object;

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

  sendSignInLink(email, opts) {
    opts = assign({ handleCodeInApp: true }, opts);
    return this.auth._withAuth(async auth => {
      await registerPromise(this, 'send-link', sendSignInLinkToEmail(auth, email, opts));
    });
  }

  signInWithLink(email, link) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in-with-link', signInWithEmailLink(auth, email, link));
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
