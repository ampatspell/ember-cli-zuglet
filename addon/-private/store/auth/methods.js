import EmberObject from '@ember/object';
import { getOwner } from '../../util/get-owner';
import { cached } from '../../model/decorators/cached';

export default class AuthMethods extends EmberObject {

  _method(name) {
    let { auth } = this;
    return getOwner(this).factoryFor(`zuglet:store/auth/methods/${name}`).create({ auth });
  }

  @cached()
  get anonymous() {
    return this._method('anonymous');
  }

  @cached()
  get email() {
    return this._method('email');
  }

}
