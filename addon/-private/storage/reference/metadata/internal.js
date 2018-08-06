import Internal from '../base/internal';
import { resolve } from 'rsvp';
import { assign } from '@ember/polyfills';

export default Internal.extend({

  ref: null,

  _metadata: null,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/metadata').create({ _internal: this });
  },

  onMetadata(_metadata) {
    this.onLoad({ _metadata });
  },

  didLoad(metadata) {
    this.onMetadata(metadata);
  },

  load(opts={}) {
    return this.ref.load(assign({ metadata: true }, opts));
  },

  _load(opts={}) {
    if(!this.shouldLoad()) {
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
  },

  onDeleted() {
    this._super({ _metadata: null });
  }

});
