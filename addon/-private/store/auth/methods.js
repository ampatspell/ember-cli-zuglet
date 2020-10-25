import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../../util/get-owner';

export default class AuthMethods extends EmberObject {

  _method(name) {
    let { auth } = this;
    return getOwner(this).factoryFor(`zuglet:store/auth/methods/${name}`).create({ auth });
  }

  @computed()
  get anonymous() {
    return this._method('anonymous');
  }

  @computed()
  get email() {
    return this._method('email');
  }

}
