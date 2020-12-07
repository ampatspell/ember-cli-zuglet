import ZugletObject from '../../object';
import { cached } from '../../model/decorators/cached';
import { getFactory } from '../../factory/get-factory';

export default class AuthMethods extends ZugletObject {

  constructor(owner, { auth }) {
    super(owner);
    this.auth = auth;
  }

  _method(name) {
    let { auth } = this;
    return getFactory(this).zuglet.create(`store/auth/methods/${name}`, { auth });
  }

  @cached()
  get anonymous() {
    return this._method('anonymous');
  }

  @cached()
  get email() {
    return this._method('email');
  }

  @cached()
  get popup() {
    return this._method('popup');
  }

}
