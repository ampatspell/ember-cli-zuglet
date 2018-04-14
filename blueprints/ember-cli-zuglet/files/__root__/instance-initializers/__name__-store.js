import register from 'ember-cli-zuglet/register';
import Store from '../store';

export default {
  name: '<%= dasherizedPackageName %>:store',
  initialize(app) {
    register({
      app,
      store: {
        identifier: 'store',
        factory: Store
      },
      // service: {
      //   enabled: true,
      //   name: 'store',
      //   inject: [ 'route', 'controller', 'component' ],
      // },
      // development: {
      //   enabled: true,
      //   export: 'store'
      // }
    });
  }
};
