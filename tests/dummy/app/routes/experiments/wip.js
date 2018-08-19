import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';

export default Route.extend({

  model: route().inline({

    prepare(route) {
      console.log('prepare');
      route.transitionTo('experiments');
    },

    init() {
      this._super(...arguments);
      console.log('init', this+'');
    },

    willDestroy() {
      this._super(...arguments);
      console.log('willDestroy', this+'');
    }

  })

});
