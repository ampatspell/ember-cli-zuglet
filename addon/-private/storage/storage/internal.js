import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import queue from '../../queue/computed';

export default Internal.extend({

  store: null,

  queue: queue('concurrent', 'store.queue'),

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:storage').create({ _internal: this });
  },

  storage: computed(function() {
    return this.store.app.storage();
  }).readOnly(),

  tasks: computed(function() {
    let content = this.get('queue.operations');
    return this.factoryFor('zuglet:storage/tasks').create({ content });
  }).readOnly(),

  //

  refFromOptions(opts={}) {
    if(typeof opts === 'string') {
      opts = { path: opts };
    }

    let { path, url } = opts;
    assert(`path or url is requied`, path || url);

    let storage = this.get('storage');
    if(path) {
      return storage.ref(path);
    }
    return storage.refFromURL(url);
  },

  createInternalReference(ref) {
    return this.factoryFor('zuglet:storage/reference/internal').create({ storage: this, ref });
  },

  createInternalReferenceWithOptions(opts) {
    let ref = this.refFromOptions(opts);
    return this.createInternalReference(ref);
  },

});
