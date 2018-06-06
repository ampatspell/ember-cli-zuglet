import Internal from '../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  store: null,
  fn: null,

  createModel() {
    return this.store.factoryFor('zuglet:transaction').create({ _internal: this });
  },

  run() {
    let firestore = this.store.app.firestore();
    return resolve().then(() => firestore.runTransaction(tx => {
      if(this.isDestroying) {
        return resolve();
      }

      this.tx = tx;

      let fn = this.fn;
      let model = this.model(true);
      return resolve(fn(model));
    }));
  },

  //

  load(internal, ...rest) {
    return internal.loadInTransaction(this, ...rest);
  },

  save(internal, ...rest) {
    return internal.saveInTransaction(this, ...rest);
  },

});
