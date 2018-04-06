import Reference from './reference';
import { invokeReturningModel } from '../util/internal-invoke';

export default Reference.extend({

  collection: invokeReturningModel('collection')

});
