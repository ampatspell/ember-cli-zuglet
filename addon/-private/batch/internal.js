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
    this._firestore = firestore;
    this._limit = limit;
    this._count = 0;
    this._instances = [];
  }

  _batch() {
    return this._firestore.batch();
  }

  _increment() {
    this.count++;
    let { _count, _limit, _instances } = this;
    if(_count > _limit || !_instances.length) {
      this._count = 1;
      _instances.push(this._batch());
    }
    return _instances[_instances.length - 1];
  }

  set(...args) {
    return this._increment().set(...args);
  }

  delete(...args) {
    return this._increment().delete(...args);
  }

  commit() {
    return all(this._instances.map(instance => instance.commit())).then(() => undefined);
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
    this.instance = new Batch(this.store.app.firestore(), opts.multiple ? 500 : Infinity);
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
