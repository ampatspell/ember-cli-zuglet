import { initialize } from 'ember-cli-zuglet/initialize';
import Store from '../store';

export default {
  name: '<%= dasherizedPackageName %>:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    },
    // service: {
    //   enabled: true,
    //   name: 'store',
    //   inject: [ 'route', 'controller', 'component', 'model' ],
    // },
    // development: {
    //   enabled: true,
    //   export: 'store',
    //   logging: true
    // }
  })
};
