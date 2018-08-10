import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/less-experimental';

export default Route.extend({

  model: route().mapping((route, params) => {
    let blog = route.modelFor('experiments.blogs.blog');
    let id = params.post_id;
    return {
      blog,
      id
    }
  })

});
