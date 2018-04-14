import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  firestore: {
    persistenceEnabled: true
  }
};

if(!options.firebase.projectId) {
  // eslint-disable-next-line no-console
  console.log([
    '',
    '🔥',
    '',
    'No Firebase config provided.',
    'Get your Firebase project configuration from https://console.firebase.google.com/',
    'and paste it in the `app/store.js`',
    '',
    ''
  ].join('\n'));
}

export default Store.extend({

  options

});
