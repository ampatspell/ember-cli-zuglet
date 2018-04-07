import Reference from '../reference';
import { readOnly } from '@ember/object/computed';
import { invokeReturningModel, invokePromiseReturningModel } from '../../internal/invoke';

export default Reference.extend({

  id: readOnly('_internal.id'),
  path: readOnly('_internal.path'),

  collection: invokeReturningModel('collection'),

  load: invokePromiseReturningModel('load'),
  new:  invokeReturningModel('new')

});
