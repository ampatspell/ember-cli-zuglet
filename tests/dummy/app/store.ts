import Store from 'zuglet/store';
import { load } from 'zuglet/utils';
import envionment from './config/environment';

const { dummy: { firebase } } = envionment;
const persistenceEnabled = envionment.environment !== 'test';

export default class DummyStore extends Store {

  options = {
    firebase,
    firestore: {
      persistenceEnabled
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

  async load(): Promise<void> {
    await load(this.auth);
  }

}
