import Reference from './reference';
import { invokeReturningModel, invokePromiseReturningModel } from '../util/internal-invoke';

export default Reference.extend({

  collection: invokeReturningModel('collection'),

  load: invokePromiseReturningModel('load'),
  new:  invokeReturningModel('new')

});
