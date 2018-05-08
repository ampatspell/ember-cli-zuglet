import Reference from '../reference';
import { readOnly } from '@ember/object/computed';
import { invoke, invokeReturningModel, invokePromiseReturningModel } from '../../internal/invoke';

const observe = () => invoke('observe', ({ doc, cancel, promise }) => ({ doc: doc.model(true), cancel, promise }));

export default Reference.extend({

  id: readOnly('_internal.id'),
  path: readOnly('_internal.path'),

  collection: invokeReturningModel('collection'),

  load: invokePromiseReturningModel('load'),
  new: invokeReturningModel('new'),
  existing: invokeReturningModel('existing'),
  observe: observe(),

});
