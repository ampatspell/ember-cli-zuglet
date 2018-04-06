import Reference from './reference';
import { invokeReturningModel } from '../util/internal-invoke';

export default Reference.extend({

  collection: invokeReturningModel('collection'),

  load(opts) {
    return this._internal.load(opts).then(internal => {
      return internal && internal.model(true);
    });
  },

  new(props) {
    return this._internal.new(props).model(true);
  }

});
