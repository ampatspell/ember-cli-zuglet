import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';
import { event } from '../../scenarios';
import { inject as service } from '@ember/service';

export default Route.extend({

  model: route().inline({

    router: service(),

    prepare() {
      event('redirect-to-external.index', 'prepare', this);
      this.router.transitionTo('scenarios');
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
