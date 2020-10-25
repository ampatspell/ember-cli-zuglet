import { initialize } from 'zuglet/initialize';
import { setGlobal } from 'zuglet/util';
import Store from '../store';

export default {
  name: 'dummy:dev',
  initialize(app) {
    initialize(app, {
      store: {
        identifier: 'store',
        factory: Store
      }
    });
    let router = app.lookup('service:router');
    setGlobal({ router });
  }
}
