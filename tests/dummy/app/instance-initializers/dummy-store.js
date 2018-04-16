import Store from '../store';
import register from 'ember-cli-zuglet/register';

export default {
  name: 'dummy:store',
  initialize(app) {

    register({
      app,
      store: {
        identifier: 'store',
        factory: Store
      }
    });
    
  }
};
