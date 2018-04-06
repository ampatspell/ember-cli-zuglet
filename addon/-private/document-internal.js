import { computed } from '@ember/object';
import Internal from './internal';
import setChangedProperties from './util/set-changed-properties';

export const state = [ 'isLoading', 'isLoaded', 'isError', 'error' ];
export const meta = [ 'exists', 'metadata' ];

export default Internal.extend({

  store: null,
  ref: null,

  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null,
  exists: undefined,
  _metadata: undefined,

  metadata: computed('_metadata', function() {
    let metadata = this.get('_metadata');
    if(!metadata) {
      return;
    }
    return {
      fromCache: metadata.fromCache,
      hasPendingWrites: metadata.hasPendingWrites
    };
  }).readOnly(),

  createModel() {
    return this.store.factoryFor('zuglet:document').create({ _internal: this });
  },

  _didLoad(snapshot) {
    let { exists, metadata: _metadata } = snapshot;
    setChangedProperties(this, {
      isLoading: false,
      isLoaded: true,
      isError: false,
      error: null,
      exists,
      _metadata
    });
  },

  onSnapshot(snapshot) {
    let data = snapshot.data({ serverTimestamps: 'estimate' });
    this.set('data', data);

    this._didLoad(snapshot, data);
  }

});