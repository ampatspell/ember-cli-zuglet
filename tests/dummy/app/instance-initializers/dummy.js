import { initialize } from 'zuglet/initialize';
import { registerDeprecationHandler } from '@ember/debug';
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
    registerDeprecationHandler((message, options, next) => {
      if(options.id === 'ember-global') {
        return;
      }
      next(message, options);
    });
  }
}
