import Store from 'zuglet/store';
import envionment from './config/environment';

let { dummy: { firebase } } = envionment;

export default class DummyStore extends Store {

  options = {
    firebase,
    firestore: {
      persistenceEnabled: true
    },
    auth: {
      user: 'user'
    },
    functions: {
      region: null
    },
    emulators: {
      // host: 'localhost',
      // auth: 9099,
      // firestore: 8080,
      // functions: 5001
    }
  }

}

