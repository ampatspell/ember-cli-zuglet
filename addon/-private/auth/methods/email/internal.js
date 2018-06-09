import Internal from '../method/internal';

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
  }

});
