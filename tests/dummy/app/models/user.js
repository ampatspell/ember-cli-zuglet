import User from 'zuglet/user';

export default class DummyUser extends User {

  async restore(user /*, details*/) {
    await super.restore(user);
    // console.log(this.uid, details);
  }

}
