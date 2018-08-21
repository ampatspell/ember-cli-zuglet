import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';
import { event } from '../../scenarios';

export default Route.extend({

  model: route().inline({

    prepare(route) {
      event('redirect-to-external.index', 'prepare', this);
      route.transitionTo('scenarios');
    },

    init() {
      this._super(...arguments);
      event('redirect-to-external.index', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      event('redirect-to-external.index', 'willDestroy', this);
    }

  })

});
