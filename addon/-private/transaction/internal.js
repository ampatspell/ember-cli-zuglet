import Internal from '../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  store: null,
  fn: null,
  instance: null,

  createModel() {
    return this.store.factoryFor('zuglet:transaction').create({ _internal: this });
  },

  run() {
    let firestore = this.store.app.firestore();
    return resolve().then(() => firestore.runTransaction(instance => {
      if(this.isDestroying) {
        return resolve();
      }

      this.instance = instance;

      let fn = this.fn;
      let model = this.model(true);
      return resolve(fn(model));
    })).then(() => undefined);
  },

  //

  load(internal, opts) {
    return internal.loadInTransaction(this, opts);
  },

  save(internal, opts) {
    internal.saveInTransaction(this, opts);
  }

});
