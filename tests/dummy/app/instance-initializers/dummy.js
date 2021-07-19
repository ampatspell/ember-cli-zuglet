import { initialize } from 'zuglet/initialize';
import Store from '../store';
import { registerDeprecationHandler } from '@ember/debug';

export default {
  name: 'dummy:dev',
  initialize(app) {
    registerDeprecationHandler((message, options, next) => {
      if(options.id === 'manager-capabilities.modifiers-3-13') {
        return;
      }
      next(message, options, next);
    });
    initialize(app, {
      store: {
        identifier: 'store',
        factory: Store
      }
    });
  }
}
