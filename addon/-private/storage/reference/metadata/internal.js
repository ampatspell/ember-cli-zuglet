import Internal from '../base/internal';
import setChangedProperties from '../../../util/set-changed-properties';
import { resolve, reject } from 'rsvp';
import { assign } from '@ember/polyfills';

export const state = [ 'isExisting', 'isLoading', 'isLoaded', 'isError', 'error' ];

export default Internal.extend({

  ref: null,

  isExisting: undefined,
  isLoading:  false,
  isLoaded:   false,
  isError:    false,
  error:      null,

  _metadata: null,

  factoryFor(name) {
    return this.ref.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:storage/reference/metadata').create({ _internal: this });
  },

  onMetadata(_metadata) {
    setChangedProperties(this, { isLoading: false, isLoaded: true, isExisting: true, _metadata });
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

  willLoad() {
    setChangedProperties(this, { isLoading: true, isError: false, error: null });
  },

  didLoad(metadata) {
    this.onMetadata(metadata);
  },

  loadDidFail(error, opts) {
    return this.onError(error, opts.optional);
  },

  load(opts={}) {
    return this.ref.load(assign({ url: false, metadata: true }, opts));
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
