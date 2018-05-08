import Internal from '../method/internal';

export default Internal.extend({

  signIn() {
    return this.withAuthReturningUser(auth => {
      return auth.signInAnonymouslyAndRetrieveData().then(({ user }) => user);
    });
  }

});
