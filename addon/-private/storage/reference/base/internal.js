import Internal from '../../../internal/internal';
import queue from '../../../queue/computed';
import setChangedProperties from '../../../util/set-changed-properties';
import { reject } from 'rsvp';

export const state = [ 'isExisting', 'isLoading', 'isLoaded', 'isError', 'error' ];

export default Internal.extend({

  queue: queue('serialized', 'ref.storage.queue'),

  isExisting: undefined,
  isLoading:  false,
  isLoaded:   false,
  isError:    false,
  error:      null,

  factoryFor(name) {
    return this.ref.factoryFor(name);
  },

  willLoad() {
    setChangedProperties(this, { isLoading: true, isError: false, error: null });
  },

  onError(error, optional) {
    if(error.code === 'storage/object-not-found') {
      if(optional) {
        setChangedProperties(this, { isLoading: false, isLoaded: true, isExisting: false });
        return;
      } else {
        setChangedProperties(this, { isLoading: false, isExisting: false, isLoaded: true, isError: true, error });
      }
    } else {
      setChangedProperties(this, { isLoading: false, isError: true, error });
    }
    return reject(error);
  },

  loadDidFail(error, opts) {
    return this.onError(error, opts.optional);
  }

});
