import Internal from '../base/internal';
import setChangedProperties from '../../../util/set-changed-properties';
import { resolve } from 'rsvp';
import { assign } from '@ember/polyfills';

export default Internal.extend({

  ref: null,

  _metadata: null,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/metadata').create({ _internal: this });
  },

  onMetadata(_metadata) {
    setChangedProperties(this, { isLoading: false, isLoaded: true, isExisting: true, _metadata });
  },

  didLoad(metadata) {
    this.onMetadata(metadata);
  },

  load(opts={}) {
    return this.ref.load(assign({ metadata: true }, opts));
  },

  _load(opts={}) {
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading) {
      return resolve();
    }

    return this.get('queue').schedule({
      name: 'storage/reference/metadata/load',
      reuse: operations => operations.findBy('name', 'storage/reference/metadata/load'),
      invoke: () => {
        this.willLoad();
        return this.get('ref.ref').getMetadata();
      },
      didResolve: metadata => this.didLoad(metadata),
      didReject: err => this.loadDidFail(err, opts)
    });
  },

  //

  didUpdate(metadata) {
    this.onMetadata(metadata);
  },

  updateDidFail(err) {
    return this.onError(err, false);
  },

  update(metadata) {
    return this.get('queue').schedule({
      name: 'storage/reference/metadata/update',
      reuse: operations => operations.findBy('name', 'storage/reference/metadata/update'),
      invoke: () => this.get('ref.ref').updateMetadata(metadata),
      didResolve: metadata => this.didUpdate(metadata),
      didReject: err => this.updateDidFail(err)
    });
  }

});
