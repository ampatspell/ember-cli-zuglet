import User from 'zuglet/user';
import { toPrimitive } from 'zuglet/utils';

export default class DummyUser extends User {

  get serialized() {
    return Object.assign({
      instance: toPrimitive(this)
    }, super.serialized);
  }

}
