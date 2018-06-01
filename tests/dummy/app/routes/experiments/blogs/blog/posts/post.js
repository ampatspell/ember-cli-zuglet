import Route from '@ember/routing/route';
import { model } from 'ember-cli-zuglet/experimental/route';
// import { observed } from 'ember-cli-zuglet/experimental/computed';
// import { reject } from 'rsvp';

export default Route.extend({

  model: model((route, params) => {
    let blog = route.modelFor('experiments.blogs.blog');
    let id = params.post_id;
    return {
      blog,
      id
    }
  }),

  // model: inline({
  //
  //   blog: null,
  //   post: null,
  //
  //   prepare(route, params) {
  //     let blog = route.modelFor('experiments.blogs.blog');
  //     let id = params.post_id;
  //
  //     let post = blog.get('posts.content').findBy('id', id);
  //     if(!post) {
  //       return reject(new Error(`Post '${id}' was not found`));
  //     }
  //
  //     this.setProperties({
  //       blog,
  //       post
  //     });
  //   }
  //
  // })

});
