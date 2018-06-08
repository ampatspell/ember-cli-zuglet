import Internal from '../base/internal';
import { assign } from '@ember/polyfills';
import setChangedProperties from '../../../util/set-changed-properties';
import { resolve } from 'rsvp';

export default Internal.extend({

  ref: null,

  value: null,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/url').create({ _internal: this });
  },

  load(opts={}) {
    return this.ref.load(assign({ url: true }, opts));
  },

  didLoad(value) {
    setChangedProperties(this, { isLoading: false, isLoaded: true, isExisting: true, value });
  },

  _load(opts={}) {
    let { isLoaded, isLoading } = this.getProperties('isLoaded', 'isLoading');

    if(isLoaded && !isLoading) {
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
