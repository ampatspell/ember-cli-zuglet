import Store from 'ember-cli-zuglet/store';
import environment from '../../config/environment';

const {
  firebase: options
} = environment;

delete options.firebase.messagingSenderId;

options.firestore.persistenceEnabled = false;

export const TestStore = Store.extend({
  options
});

export default (hooks, identifier='test') => {
  hooks.beforeEach(async function() {
    this.store = this.stores.createStore(identifier, TestStore);
    await this.stores.get('ready');
    this.app = this.store._internal.app;
    this.firestore = this.app.firestore();
  });
};
