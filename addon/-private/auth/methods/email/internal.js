import Internal from '../method/internal';

export default Internal.extend({

  signIn(email, password) {
    return this.withAuthReturningUser(auth => {
      return auth.signInAndRetrieveDataWithEmailAndPassword(email, password).then(({ user }) => user);
    });
  },

  signUp(email, password) {
    return this.withAuthReturningUser(auth => {
      return auth.createUserAndRetrieveDataWithEmailAndPassword(email, password).then(({ user }) => user);
    });
  }

});
