import Route from '@ember/routing/route';
import model from 'ember-cli-zuglet/experimental/model/route';

export default Route.extend({

  model: model().mapping((route, params) => {
    let blog = route.modelFor('experiments.blogs.blog');
    let id = params.post_id;
    return {
      blog,
      id
    }
  })

});
