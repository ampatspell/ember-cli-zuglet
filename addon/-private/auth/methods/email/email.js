import Method from '../method/method';
import { invokePromiseReturningModel, invokePromiseReturningUndefined } from '../../../internal/invoke';

export default Method.extend({

  signIn: invokePromiseReturningModel('signIn'),
  signUp: invokePromiseReturningModel('signUp'),

  sendPasswordReset: invokePromiseReturningUndefined('sendPasswordReset'),

});
