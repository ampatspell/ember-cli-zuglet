import { readOnly } from '@ember/object/computed';
import Reference from './reference';
import QueryableMixin from './queryable-mixin';
import { invokeReturningModel } from '../util/internal-invoke';

export default Reference.extend(QueryableMixin, {

  id: readOnly('_internal.id'),
  path: readOnly('_internal.path'),

  doc: invokeReturningModel('doc')
  
});
