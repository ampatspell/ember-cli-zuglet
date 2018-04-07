import { readOnly } from '@ember/object/computed';
import Reference from './reference';
import { invokeReturningModel, invokePromiseReturningModel } from '../util/internal-invoke';

export default Reference.extend({

  id: readOnly('_internal.id'),
  path: readOnly('_internal.path'),

  collection: invokeReturningModel('collection'),

  load: invokePromiseReturningModel('load'),
  new:  invokeReturningModel('new'),

  toStringExtension() {
    let path = this.get('path');
    return `${path}`;
  }

});
