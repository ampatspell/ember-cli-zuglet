import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { event } from '../../scenarios';

export default Route.extend({

  model: route().inline({

    prepare(route, params) {
      event('redirect-to-nested.models', 'prepare', this);
      this.id = params.model_id;
    },

    init() {
      this._super(...arguments);
      event('redirect-to-nested.models', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      event('redirect-to-nested.models', 'willDestroy', this);
    }

  })

});
