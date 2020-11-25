import User from 'zuglet/user';

export default class <%= classifiedPackageName %>User extends User {

  async restore(user) {
    await super.restore(user);
  }

}
