import { initialize } from 'zuglet/initialize';
import { setGlobal } from 'zuglet/util';

export default {
  name: 'dummy:dev',
  initialize(app) {
    let store = initialize(app, {
      service: {
        name: 'store'
      }
    });
    setGlobal({ store });
  }
}
