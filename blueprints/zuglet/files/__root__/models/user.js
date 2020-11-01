import BaseUser from 'zuglet/user';

export default class User extends BaseUser {

  async restore(user) {
    await super.restore(user);
  }

}
