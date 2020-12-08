import ZugletObject from '../../../object';

export default class AuthMethod extends ZugletObject {

  constructor(owner, { auth }) {
    super(owner);
    this.auth = auth;
  }

}
