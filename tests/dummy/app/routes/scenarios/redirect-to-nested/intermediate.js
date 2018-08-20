import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';
import { event } from '../../scenarios';

export default Route.extend({

  model: route().inline({

    prepare(route) {
      console.log('intermediate');
      event('redirect-to-nested.intermediate', 'prepare', this);
      route.transitionTo('scenarios.redirect-to-nested.models', 'default');
    },

    init() {
      this._super(...arguments);
      event('redirect-to-nested.intermediate', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      event('redirect-to-nested.intermediate', 'willDestroy', this);
    }

  })

});
