import Mixin from '@ember/object/mixin';
import { invokeReturningModel } from '../../internal/invoke';
import { keys } from './internal-mixin';

export default Mixin.create(keys.reduce((hash, key) => {
  hash[key] = invokeReturningModel(key);
  return hash;
}, {}), {

  query: invokeReturningModel('query'),

  load(opts) {
    return this._internal.load(opts);
  },

  first(opts) {
    return this._internal.first(opts);
  }

});
