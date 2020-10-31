import User from 'zuglet/user';

export default class DummyUser extends User {

  async restore(user, details) {
    await super.restore(user);
    if(details) {
      console.log('restore details', details);
    }
  }

}
