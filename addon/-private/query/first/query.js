import Query from '../query';
import { readOnly } from '@ember/object/computed';

export default Query.extend({

  content: readOnly('_internal.content')

});
