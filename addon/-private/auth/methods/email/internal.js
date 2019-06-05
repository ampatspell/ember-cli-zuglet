import Internal from '../method/internal';
import firebase from 'firebase';

export default Internal.extend({

  signIn(email, password) {
    return this.withAuthReturningUser(auth => {
      return auth.signInWithEmailAndPassword(email, password).then(({ user }) => user);
    });
  },

  signUp(email, password) {
    return this.withAuthReturningUser(auth => {
      return auth.createUserWithEmailAndPassword(email, password).then(({ user }) => user);
    });
  },

  credential(email, password) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  },

  sendPasswordReset(email, opts) {
    return this.withAuth(auth => {
      return auth.sendPasswordResetEmail(email, opts);
    });
  }

});
