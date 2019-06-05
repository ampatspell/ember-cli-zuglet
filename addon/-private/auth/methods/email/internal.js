import Internal from '../method/internal';
import { reject } from 'rsvp';
import { currentUserRequiredError } from '../../../util/errors';
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

  link(email, password) {
    let credential = this.credential(email, password);
    return this.withAuthReturningUser(() => {
      let user = this.get('auth.user');
      if(!user) {
        return reject(currentUserRequiredError());
      }
      return user.linkAndRetrieveDataWithCredential(credential).then(({ user }) => user);
    });
  }

});
