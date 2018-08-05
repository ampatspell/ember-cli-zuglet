import Internal from '../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  store: null,
  instance: null,
  fn: null,

  init() {
    this._super(...arguments);
    this.instance = this.store.app.firestore().batch();
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
