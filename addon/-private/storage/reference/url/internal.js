import Internal from '../base/internal';
import { assign } from '@ember/polyfills';
import { resolve } from 'rsvp';

export default Internal.extend({

  ref: null,

  value: undefined,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/url').create({ _internal: this });
  },

  load(opts={}) {
    return this.ref.load(assign({ url: true }, opts));
  },

  didLoad(value) {
    this.onLoad({ value });
  },

  _load(opts={}) {
    if(!this.shouldLoad()) {
      return resolve();
    }

    return this.get('queue').schedule({
      name: 'storage/reference/url/load',
      reuse: operations => operations.findBy('name', 'storage/reference/url/load'),
      invoke: () => {
        this.willLoad();
        return this.get('ref.ref').getDownloadURL();
      },
      didResolve: url => this.didLoad(url),
      didReject: err => this.loadDidFail(err, opts)
    });
  },


});
