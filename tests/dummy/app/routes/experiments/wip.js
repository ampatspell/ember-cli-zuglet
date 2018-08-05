import Route from '@ember/routing/route';
import route from 'ember-cli-zuglet/experimental/model/route';
import model from 'ember-cli-zuglet/experimental/model';

export default Route.extend({

  model: route({

    id: 'book',

    inner: model('id', owner => {
      let id = owner.id;
      if(!id) {
        return;
      }
      return `experiments/wip/${id}`;
    }).mapping(owner => {
      let { id } = owner;
      return {
        id
      };
    }),

    prepare() {
      window.route = this;
    }

  })

});
