import AuthMethod from './method';
import firebase from 'firebase/compat/app';
import { registerPromise } from '../../../stores/stats';

const {
  assign
} = Object;

export default class EmailAuthMethod extends AuthMethod {

  signIn(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in', true, auth.signInWithEmailAndPassword(email, password));
      return { user };
    });
  }

  signUp(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-up', true, auth.createUserWithEmailAndPassword(email, password));
      return { user };
    });
  }

  sendSignInLink(email, opts) {
    opts = assign({ handleCodeInApp: true }, opts);
    return this.auth._withAuth(async auth => {
      await registerPromise(this, 'send-link', true, auth.sendSignInLinkToEmail(email, opts));
    });
  }

  signInWithLink(email, link) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await registerPromise(this, 'sign-in-with-link', true, auth.signInWithEmailLink(email, link));
      return { user };
    });
  }

  credential(email, password) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  }

  sendPasswordReset(email, opts) {
    return this.auth._withAuth(auth => {
      return registerPromise(this, 'send-password-reset', true, auth.sendPasswordResetEmail(email, opts));
    });
  }

}
