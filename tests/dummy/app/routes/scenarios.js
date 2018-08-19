import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

export const event = (route, event, model) => {
  return getOwner(model).lookup('route:application').modelFor('scenarios').event(route, event, model);
}

export default Route.extend({

  model: route().inline({

    events: computed(function() {
      return A();
    }),

    event(route, event, model) {
      this.get('events').pushObject({ route, event, model });
    },

    prepare() {
      this.event('scenarios', 'prepare', this);
    },

    init() {
      this._super(...arguments);
      this.event('scenarios', 'init', this);
    },

    willDestroy() {
      this._super(...arguments);
      this.event('scenarios', 'willDestroy', this);
    }

  })

});
