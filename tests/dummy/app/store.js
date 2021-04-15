import Store from 'zuglet/store';
import { load } from 'zuglet/utils';
import environment from './config/environment';

let { dummy: { firebase } } = environment;
let persistenceEnabled = environment.environment !== 'test';

export default class DummyStore extends Store {

  options = {
    firebase,
    firestore: {
      persistenceEnabled,
      // experimentalAutoDetectLongPolling: true,
      // experimentalForceLongPolling: true
    },
    auth: {
      user: 'user'
    },
    functions: {
      region: null
    },
    emulators: {
      host: 'localhost',
      // auth: 9099,
      // firestore: 8080,
      // functions: 5001
      // storage: 9199
    }
  }

  async load() {
    await load(this.auth);
  }

}
