import Store from '../store';
import { initialize } from 'ember-cli-zuglet/initialize';

export default {
  name: 'dummy:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    },
    development: {
      logging: false
    }
  })
};
