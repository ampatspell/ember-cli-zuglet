import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { event } from '../../scenarios';

export default Route.extend({

  model: route().inline({

    prepare(route) {
      event('redirect-to-nested.index', 'prepare', this);
      route.transitionTo('scenarios.redirect-to-nested.intermediate');
    },

    init() {
      this._super(...arguments);
      event('redirect-to-nested.index', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      event('redirect-to-nested.index', 'willDestroy', this);
    }

  })

});
