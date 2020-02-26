import Internal from '../internal/internal';
import { resolve, all } from 'rsvp';
import { assign } from '@ember/polyfills';

const normalize = args => {
  let opts;
  let fn = null;
  if(args.length === 2) {
    fn = args[0];
    opts = args[1];
  } else if(args.length === 1) {
    if(typeof args[0] === 'function') {
      fn = args[0];
    } else {
      opts = args[0];
    }
  }
  opts = assign({ multiple: false }, opts);
  return {
    fn,
    opts
  };
}

class Batch {

  constructor(firestore, limit) {
    this.firestore = firestore;
    this.limit = limit;
    this.count = 0;
    this.instances = [];
    console.log('batch limit', limit);
  }

  batch() {
    return this.firestore.batch();
  }

  increment() {
    this.count++;
    let { count, limit, instances } = this;
    if(count > limit || !instances.length) {
      this.count = 1;
      instances.push(this.batch());
    }
    return instances[instances.length - 1];
  }

  set(...args) {
    return this.increment().set(...args);
  }

  delete(...args) {
    return this.increment().delete(...args);
  }

  commit() {
    return all(this.instances.map(instance => instance.commit())).then(() => undefined);
  }

}

export default Internal.extend({

  store: null,
  instance: null,
  args: null,
  opts: null,
  fn: null,

  init() {
    this._super(...arguments);
    let { opts, fn } = normalize(this.args);
    this.setProperties({ opts, fn });
    let limit = opts.limit || 500;
    this.instance = new Batch(this.store.app.firestore(), opts.multiple ? limit : Infinity);
  },

  createModel() {
    return this.store.factoryFor('zuglet:batch').create({ _internal: this });
  },

  save(doc, opts) {
    doc.saveInBatch(this, opts);
    return doc.model(true);
  },

  delete(doc) {
    doc.deleteInBatch(this);
    return doc.model(true);
  },

  commit() {
    return this.get('store.queue').schedule({
      name: 'batch',
      promise: this.instance.commit()
    });
  },

  run() {
    let model = this.model(true);
    let fn = this.fn;
    if(fn) {
      return resolve()
        .then(() => fn.call(model, model))
        .then(result => this.commit().then(() => result));
    } else {
      return model;
    }
  }

});
