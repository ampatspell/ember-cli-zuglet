import AuthMethod from './method';
import firebase from "firebase/app";

export default class EmailAuthMethod extends AuthMethod {

  signIn(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await auth.signInWithEmailAndPassword(email, password);
      return user;
    });
  }

  signUp(email, password) {
    return this.auth._withAuthReturningUser(async auth => {
      let { user } = await auth.createUserWithEmailAndPassword(email, password);
      return user;
    });
  }

  credential(email, password) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  }

  sendPasswordReset(email, opts) {
    return this.auth._withAuth(auth => {
      return auth.sendPasswordResetEmail(email, opts);
    });
  }

}
