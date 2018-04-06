import Mixin from '@ember/object/mixin';
import { invokeReturningModel } from '../util/internal-invoke';
import { keys } from './queryable-internal-mixin';

export default Mixin.create(keys.reduce((hash, key) => {
  hash[key] = invokeReturningModel(key);
  return hash;
}, {}));
