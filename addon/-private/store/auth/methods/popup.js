import AuthMethod from './method';
import { cached } from '../../../model/decorators/cached';

export default class AuthPopopMethod extends AuthMethod {

  _method(name) {
    return this.auth.methods._method(`popup/${name}`);
  }

  @cached()
  get google() {
    return this._method('google');
  }

}
