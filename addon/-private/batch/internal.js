import Internal from '../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  store: null,
  instance: null,
  fn: null,

  createModel() {
    return this.store.factoryFor('zuglet:batch').create({ _internal: this });
  },

  save(doc, opts) {
    doc.saveInBatch(this, opts);
  },

  delete(doc) {
    doc.deleteInBatch(this);
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
        .then(() => this.commit())
        .then(() => undefined);
    } else {
      return model;
    }
  }

});
