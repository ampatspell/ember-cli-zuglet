import Internal from './internal';
import firebase from 'firebase';

export default Internal.extend({

  stores: null,
  identifier: null,
  factory: null,

  app: null,

  factoryFor(name) {
    return this.stores.factoryFor(name);
  },

  didCreateModel(model) {
    let identifier = this.identifier;
    let opts = model.get('options.firebase');
    this.app = firebase.initializeApp(opts, identifier);
  },

  createModel() {
    return this.factory.create({ _internal: this });
  },

  createInternalQuery(opts) {
    return this.factoryFor('zuglet:query/array/internal').create({ store: this, opts });
  },

  createInternalDocumentForSnapshot(snapshot) {
    let ref = snapshot.ref;
    let internal = this.factoryFor('zuglet:document/internal').create({ store: this, ref });
    internal.onSnapshot(snapshot);
    return internal;
  },

  willDestroy() {
    this.app && this.app.delete();
    this._super(...arguments);
  }

});
