import Internal from '../method/internal';

export default Internal.extend({

  signIn(email, password) {
    return this.withAuthReturningUser(auth => auth.signInAndRetrieveDataWithEmailAndPassword(email, password));
  },

  signUp(email, password) {
    return this.withAuthReturningUser(auth => auth.createUserAndRetrieveDataWithEmailAndPassword(email, password));
  }

});
