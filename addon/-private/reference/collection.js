import Reference from './reference';
import QueryableMixin from './queryable-mixin';
import { invokeReturningModel } from '../util/internal-invoke';

export default Reference.extend(QueryableMixin, {

  doc: invokeReturningModel('doc')

});
