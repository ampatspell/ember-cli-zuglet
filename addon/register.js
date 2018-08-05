import { deprecate } from '@ember/application/deprecations';
import { register } from './initialize';

deprecate(`'ember-cli-zuglet/register' is deprecated.

Please use:
import { register } from 'ember-cli-zuglet/initialize' for the same behavior

or

import Store from '../store';
import { initialize } from 'ember-cli-zuglet/initialize';

export default {
  name: 'app:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    }
  })
};`, false, {
  id: 'ember-cli-zuglet-register',
  until: '0.3.0'
});

export default register;
