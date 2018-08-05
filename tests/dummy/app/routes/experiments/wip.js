import Route from '@ember/routing/route';
import route from 'ember-cli-zuglet/experimental/model/route';
import model from 'ember-cli-zuglet/experimental/model';

export default Route.extend({

  model: route({

    id: 'book',

    inner: model().named('id', owner => {
      let { id } = owner;
      return `experiments/wip/${id}`;
    }).mapping(owner => {
      let { id } = owner;
      return {
        id
      };
    }),

    prepare() {
    }

  })

});
