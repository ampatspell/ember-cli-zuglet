import Route from '@ember/routing/route';
import { inline } from 'ember-cli-zuglet/experimental/route';
import { observed } from 'ember-cli-zuglet/experimental/computed';
import { reject } from 'rsvp';

export default Route.extend({

  model: inline({

    blog: null,
    posts: observed(),

    prepare(route, params) {
      let blogs = route.modelFor('experiments.blogs');
      let id = params.blog_id;

      let blog = blogs.get('blogs.content').findBy('id', id);
      if(!blog) {
        return reject(new Error(`Blog '${id}' was not found`));
      }

      let posts = blog.get('ref').collection('posts').query({ type: 'array' });

      this.setProperties({
        blog,
        posts
      });

      return posts.get('observers.promise');
    }

  })

});
