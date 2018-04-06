import Mixin from '@ember/object/mixin';
import { invokeReturningModel } from '../util/internal-invoke';
import { keys } from './queryable-internal-mixin';

export default Mixin.create(keys.reduce((hash, key) => {
  hash[key] = invokeReturningModel(key);
  return hash;
}, {}), {

  query: invokeReturningModel('query'),

  load() {
    return this._internal.load();
  },

  first(opts) {
    return this._internal.first(opts);
  }

});
