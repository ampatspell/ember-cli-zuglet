import Internal from '../method/internal';

export default Internal.extend({

  signIn() {
    return this.withAuthReturningUser(auth => auth.signInAnonymouslyAndRetrieveData()).then(result => result.user);
  }

});
