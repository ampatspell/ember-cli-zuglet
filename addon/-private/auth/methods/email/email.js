import Method from '../method/method';
import { invokePromiseReturningModel } from '../../../internal/invoke';

export default Method.extend({

  signIn: invokePromiseReturningModel('signIn'),
  signUp: invokePromiseReturningModel('signUp')

});
