import Reference from '../reference';
import { readOnly } from '@ember/object/computed';
import QueryableMixin from '../queryable/mixin';
import { invokeReturningModel } from '../../internal/invoke';

export default Reference.extend(QueryableMixin, {

  id: readOnly('_internal.id'),
  path: readOnly('_internal.path'),

  doc: invokeReturningModel('doc')

});
