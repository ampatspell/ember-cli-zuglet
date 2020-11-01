import BaseStore from 'zuglet/store';

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
  },
  auth: {
    user: 'user'
  },
  // functions: {
  //   region: null
  // },
  // emulators: {
  //   host: 'localhost',
  //   auth: 9099,
  //   firestore: 8080,
  //   functions: 5001
  // }
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

export default class Store extends BaseStore {

  options = options

}
