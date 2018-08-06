import Internal from '../../../internal/internal';
import queue from '../../../queue/computed';
import setChangedProperties from '../../../util/set-changed-properties';
import { reject } from 'rsvp';
import { assign } from '@ember/polyfills';

export const state = [ 'isLoading', 'isLoaded', 'isError', 'exists', 'error' ];

export default Internal.extend({

  queue: queue('serialized', 'ref.storage.queue'),

  isLoading:  false,
  isLoaded:   false,
  isError:    false,
  exists:     undefined,
  error:      null,

  factoryFor(name) {
    return this.ref.factoryFor(name);
  },

  shouldLoad() {
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading) {
      return false;
    }

    return true;
  },

  willLoad() {
    setChangedProperties(this, { isLoading: true, isError: false, error: null });
  },

  onLoad(props) {
    setChangedProperties(this, assign({ isLoading: false, isLoaded: true, exists: true }, props));
  },

  onError(error, optional) {
    if(error.code === 'storage/object-not-found') {
      if(optional) {
        setChangedProperties(this, { isLoading: false, isLoaded: true, exists: false });
        return;
      } else {
        setChangedProperties(this, { isLoading: false, exists: false, isLoaded: true, isError: true, error });
      }
    } else {
      setChangedProperties(this, { isLoading: false, isError: true, error });
    }
    return reject(error);
  },

  loadDidFail(error, opts) {
    return this.onError(error, opts.optional);
  },

  onDeleted(props) {
    setChangedProperties(this, assign({
      isLoading:  false,
      isLoaded:   false,
      isError:    false,
      exists:     undefined,
      error:      null
    }, props));
  }

});
