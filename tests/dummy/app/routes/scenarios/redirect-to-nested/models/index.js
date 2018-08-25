import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { event } from '../../../scenarios';

export default Route.extend({

  model: route().inline({

    prepare() {
      event('redirect-to-nested.models.index', 'prepare', this);
    },

    init() {
      this._super(...arguments);
      event('redirect-to-nested.models.index', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      event('redirect-to-nested.models.index', 'willDestroy', this);
    }

  })

});
