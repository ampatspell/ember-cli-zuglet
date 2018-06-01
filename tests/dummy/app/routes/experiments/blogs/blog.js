import Route from '@ember/routing/route';
import { model } from 'ember-cli-zuglet/experimental/route';

export default Route.extend({

  model: model(null, (route, params) => {
    let blogs = route.modelFor('experiments.blogs');
    let id = params.blog_id;
    return {
      blogs,
      id
    }
  })

});
