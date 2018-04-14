import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey: "AIzaSyAvm8v8kXS3iHsg3EBxAk-mZZcYdeOuj3E",
    authDomain: "ember-cli-zug-travis.firebaseapp.com",
    databaseURL: "https://ember-cli-zug-travis.firebaseio.com",
    projectId: "ember-cli-zug-travis",
    storageBucket: "ember-cli-zug-travis.appspot.com",
    messagingSenderId: "715071933357"
  },
  firestore: {
    persistenceEnabled: false
  }
};

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
