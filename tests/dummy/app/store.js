import Store from 'zuglet/store';
import { load } from 'zuglet/utils';
import envionment from './config/environment';

let { dummy: { firebase } } = envionment;
let persistenceEnabled = envionment.environment !== 'test';

export default class DummyStore extends Store {

  options = {
    firebase,
    firestore: {
      persistenceEnabled,
      experimentalAutoDetectLongPolling: true,
      // experimentalForceLongPolling: true
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

  async load() {
    await load(this.auth);
  }

}
